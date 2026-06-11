import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { existsSync, statSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { google } from 'googleapis';
import electronUpdater from 'electron-updater';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { autoUpdater } = electronUpdater;

function getLocalIsoDate(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function getClientStorePath() {
  return path.join(app.getPath('userData'), 'clients.json');
}

function getPresetStorePath() {
  return path.join(app.getPath('userData'), 'presets.json');
}

function createEmptyClientStore() {
  return { byManager: {} };
}

function createEmptyPresetStore() {
  return { byManager: {} };
}

function normalizeClientName(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeManagerName(value) {
  return normalizeClientName(value) || '__default__';
}

async function loadClientStoreFromDisk() {
  try {
    const raw = await readFile(getClientStorePath(), 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return createEmptyClientStore();
    const byManager = parsed.byManager && typeof parsed.byManager === 'object' ? parsed.byManager : {};
    const next = createEmptyClientStore();

    Object.entries(byManager).forEach(([manager, list]) => {
      if (!Array.isArray(list)) return;
      next.byManager[manager] = [];
      const seen = new Set();
      list.forEach((item) => {
        const name = normalizeClientName(item);
        if (!name) return;
        const key = name.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        next.byManager[manager].push(name);
      });
    });

    return next;
  } catch {
    return createEmptyClientStore();
  }
}

async function saveClientStoreToDisk(store) {
  const filePath = getClientStorePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(store, null, 2), 'utf8');
}

function normalizePresetName(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

async function loadPresetStoreFromDisk() {
  try {
    const raw = await readFile(getPresetStorePath(), 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return createEmptyPresetStore();
    const byManager = parsed.byManager && typeof parsed.byManager === 'object' ? parsed.byManager : {};
    const next = createEmptyPresetStore();

    Object.entries(byManager).forEach(([manager, list]) => {
      if (!Array.isArray(list)) return;
      const managerKey = normalizeManagerName(manager);
      next.byManager[managerKey] = [];
      const seen = new Set();

      list.forEach((item) => {
        const name = normalizePresetName(item?.name ?? item);
        if (!name) return;
        const key = name.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);

        next.byManager[managerKey].push({
          id: normalizePresetName(item?.id) || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name,
          data: item?.data && typeof item.data === 'object' ? item.data : {},
          createdAt: item?.createdAt || new Date().toISOString(),
          updatedAt: item?.updatedAt || item?.createdAt || new Date().toISOString(),
        });
      });
    });

    return next;
  } catch {
    return createEmptyPresetStore();
  }
}

async function savePresetStoreToDisk(store) {
  const filePath = getPresetStorePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(store, null, 2), 'utf8');
}

async function upsertClientEntry(managerName, clientName) {
  const managerKey = normalizeManagerName(managerName);
  const name = normalizeClientName(clientName);
  if (!name) return { success: true, store: await loadClientStoreFromDisk(), added: false };

  const store = await loadClientStoreFromDisk();
  const list = Array.isArray(store.byManager[managerKey]) ? [...store.byManager[managerKey]] : [];
  const exists = list.some((item) => normalizeClientName(item).toLowerCase() === name.toLowerCase());

  if (!exists) {
    list.push(name);
    store.byManager[managerKey] = list;
    await saveClientStoreToDisk(store);
    return { success: true, store, added: true };
  }

  return { success: true, store, added: false };
}

function clonePresetData(data) {
  return JSON.parse(JSON.stringify(data || {}));
}

async function upsertPresetEntry(managerName, presetName, presetData) {
  const managerKey = normalizeManagerName(managerName);
  const name = normalizePresetName(presetName);
  if (!name) return { success: false, error: 'empty_name' };

  const store = await loadPresetStoreFromDisk();
  const list = Array.isArray(store.byManager[managerKey]) ? [...store.byManager[managerKey]] : [];
  const now = new Date().toISOString();
  const payload = clonePresetData(presetData);
  const existingIndex = list.findIndex((item) => normalizePresetName(item.name).toLowerCase() === name.toLowerCase());

  if (existingIndex >= 0) {
    const existing = list[existingIndex];
    list[existingIndex] = {
      ...existing,
      name,
      data: payload,
      updatedAt: now,
    };
  } else {
    list.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      data: payload,
      createdAt: now,
      updatedAt: now,
    });
  }

  store.byManager[managerKey] = list;
  await savePresetStoreToDisk(store);
  return { success: true, store };
}

function formatDateTimeCell(date, time) {
  const dateText = date ? date.split('-').reverse().join('.') : 'вЂ”';
  return time ? `${dateText}\n${time}` : dateText;
}

function formatQuantityCell(value) {
  const normalized = String(value || '').replace(/\s+/g, '').trim();
  if (!normalized) return 'РІР‚вЂ”';
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return normalized;
  return parsed.toLocaleString('ru-RU').replace(/\u00A0/g, ' ');
}

function buildDeadlineCell(formData) {
  const subcontractWorks = Array.isArray(formData?.subcontractWorks) ? formData.subcontractWorks : [];
  const activeSubcontractWorks = subcontractWorks.filter((work) => work?.note?.trim() || work?.date || work?.time);

  if (activeSubcontractWorks.length === 0) {
    return formatDateTimeCell(formData.deadline, formData.deadlineTime);
  }

  const lines = [];
  activeSubcontractWorks.forEach((work, index) => {
    if (work?.note?.trim()) lines.push(work.note.trim());
    lines.push(formatDateTimeCell(work?.date, work?.time));
    if (index < activeSubcontractWorks.length - 1) lines.push('');
  });
  lines.push('');
  lines.push('Тираж:');
  lines.push(formatDateTimeCell(formData.deadline, formData.deadlineTime));
  return lines.join('\n');
}

// ТВОЙ ID ТАБЛИЦЫ
const SPREADSHEET_ID = '1TZkMbDMhx0XhK3Y-DOS4AgpbakmotaugXEPGKF_xLok'; 
const CONFIG_SHEET_TITLE = '__CONFIG__';

// УНИВЕРСАЛЬНЫЙ ПУТЬ К КЛЮЧУ:
// Если программа собрана (.exe), она ищет ключ в папке рядом с .exe.
// Если запущена в режиме разработки, ищет в папке electron-app.
const KEY_PATH = app.isPackaged 
  ? path.join(process.resourcesPath, 'google-key.json') 
  : path.join(__dirname, 'google-key.json');

function normalizeSheetCell(value) {
  return String(value ?? '').trim();
}

function getRowCell(row, index) {
  return normalizeSheetCell(Array.isArray(row) ? row[index] : '');
}

function isRowAvailable(row, managerMarker) {
  const clientCell = getRowCell(row, 1);
  if (clientCell) return false;

  const markerCell = getRowCell(row, 25);
  if (!markerCell) return true;

  return !!managerMarker && markerCell === managerMarker;
}

function findAvailableBlock(rows, managerMarker, blockSize, maxRows) {
  const upperBound = Math.max(Number(maxRows) || 0, rows.length, blockSize);
  const lastStart = Math.max(2, upperBound - blockSize + 1);

  for (let startRow = 2; startRow <= lastStart; startRow += 1) {
    let available = true;

    for (let offset = 0; offset < blockSize; offset += 1) {
      if (!isRowAvailable(rows[startRow - 1 + offset], managerMarker)) {
        available = false;
        break;
      }
    }

    if (available) return startRow;
  }

  return -1;
}

async function ensureSheetRowCount(sheets, sheetId, currentRowCount, requiredRowCount) {
  if (!sheetId || requiredRowCount <= currentRowCount) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          appendDimension: {
            sheetId,
            dimension: 'ROWS',
            length: requiredRowCount - currentRowCount,
          },
        },
      ],
    },
  });
}

function buildOrangeRuns(text) {
  const needle = 'УФ-лак';
  const runs = [{ startIndex: 0, format: { foregroundColorStyle: { rgbColor: { red: 0, green: 0, blue: 0 } } } }];
  let index = text.indexOf(needle);

  while (index !== -1) {
    runs.push({ startIndex: index, format: { foregroundColorStyle: { rgbColor: { red: 0.93, green: 0.43, blue: 0.08 } } } });
    if (index + needle.length < text.length) {
      runs.push({ startIndex: index + needle.length, format: { foregroundColorStyle: { rgbColor: { red: 0, green: 0, blue: 0 } } } });
    }
    index = text.indexOf(needle, index + needle.length);
  }

  return runs.sort((a, b) => a.startIndex - b.startIndex);
}

let mainWindow;
let latestUpdateState = null;
let updatePromptOpen = false;
let updateRestartPromptOpen = false;

function getUpdateWindow() {
  return mainWindow && !mainWindow.isDestroyed() ? mainWindow : undefined;
}

async function askToDownloadUpdate(info) {
  if (updatePromptOpen) return;
  updatePromptOpen = true;
  try {
    const win = getUpdateWindow();
    const result = await dialog.showMessageBox(win, {
      type: 'info',
      buttons: ['Загрузить', 'Позже'],
      defaultId: 0,
      cancelId: 1,
      title: 'Доступно обновление',
      message: `Найдена новая версия ${info.version}.`,
      detail: 'Хотите скачать и установить обновление сейчас?',
    });

    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  } finally {
    updatePromptOpen = false;
  }
}

async function askToRestartAfterDownload(info) {
  if (updateRestartPromptOpen) return;
  updateRestartPromptOpen = true;
  try {
    const win = getUpdateWindow();
    const result = await dialog.showMessageBox(win, {
      type: 'info',
      buttons: ['Перезапустить сейчас', 'Позже'],
      defaultId: 0,
      cancelId: 1,
      title: 'Обновление загружено',
      message: `Версия ${info.version} загружена.`,
      detail: 'Перезапустите приложение, чтобы завершить установку обновления.',
    });

    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  } finally {
    updateRestartPromptOpen = false;
  }
}

function setupAutoUpdater() {
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = false;

  autoUpdater.on('update-available', (info) => {
    askToDownloadUpdate(info).catch((error) => console.error('Ошибка показа диалога обновления:', error));
  });

  autoUpdater.on('download-progress', (progress) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setProgressBar(progress.percent > 0 && progress.percent < 100 ? progress.percent / 100 : 0);
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setProgressBar(0);
    }
    askToRestartAfterDownload(info).catch((error) => console.error('Ошибка показа диалога перезапуска:', error));
  });

  autoUpdater.on('error', (error) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setProgressBar(0);
    }
    console.error('AutoUpdater error:', error);
  });
}

async function checkForAppUpdates() {
  if (!app.isPackaged) return;

  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    console.error('Ошибка проверки обновлений:', error);
  }
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function htmlToPlainText(text) {
  if (!text) return '';
  return decodeHtmlEntities(
    String(text)
      .replace(/<\s*br\s*\/?\s*>/gi, '\n')
      .replace(/<\/\s*p\s*>/gi, '\n\n')
      .replace(/<\/\s*li\s*>/gi, '\n')
      .replace(/<\s*li[^>]*>/gi, '• ')
      .replace(/<\/?[^>]+>/g, '')
  )
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeReleaseNotes(notes) {
  if (Array.isArray(notes)) {
    return notes
      .map((item) => (typeof item === 'string' ? item : item?.note || ''))
      .map((item) => htmlToPlainText(item))
      .filter(Boolean)
      .join('\n\n')
      .trim();
  }

  if (typeof notes === 'string') {
    return htmlToPlainText(notes);
  }

  return '';
}

function sendUpdateState(payload) {
  latestUpdateState = payload ? { ...payload } : null;
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update-status', latestUpdateState);
  }
}

function clearUpdateProgress() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setProgressBar(-1);
  }
}

function setupVisualAutoUpdater() {
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = false;

  autoUpdater.on('checking-for-update', () => {
    sendUpdateState({ status: 'checking' });
  });

  autoUpdater.on('update-not-available', () => {
    sendUpdateState({ status: 'idle' });
    clearUpdateProgress();
  });

  autoUpdater.on('update-available', (info) => {
    sendUpdateState({
      status: 'available',
      version: info.version,
      releaseName: info.releaseName || '',
      notes: normalizeReleaseNotes(info.releaseNotes),
    });
  });

  autoUpdater.on('download-progress', (progress) => {
    clearUpdateProgress();
    if (mainWindow && !mainWindow.isDestroyed()) {
      const progressValue = progress.percent > 0 && progress.percent < 100 ? progress.percent / 100 : 0;
      mainWindow.setProgressBar(progressValue);
    }

    sendUpdateState({
      status: 'downloading',
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total,
      bytesPerSecond: progress.bytesPerSecond,
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    clearUpdateProgress();
    sendUpdateState({
      status: 'downloaded',
      version: info.version,
      releaseName: info.releaseName || '',
      notes: normalizeReleaseNotes(info.releaseNotes),
    });
  });

  autoUpdater.on('error', (error) => {
    clearUpdateProgress();
    sendUpdateState({
      status: 'error',
      error: error?.message || String(error),
    });
    console.error('AutoUpdater error:', error);
  });
}

function createSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

async function getSpreadsheetMeta(sheets) {
  const response = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  return response.data;
}

async function ensureConfigSheet(sheets) {
  const meta = await getSpreadsheetMeta(sheets);
  const existing = meta.sheets?.find((sheet) => sheet.properties?.title === CONFIG_SHEET_TITLE);
  if (existing?.properties?.sheetId) return existing.properties.sheetId;

  const batchResponse = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: CONFIG_SHEET_TITLE,
              hidden: true,
            },
          },
        },
      ],
    },
  });

  const addedSheet = batchResponse.data.replies?.[0]?.addSheet?.properties;
  return addedSheet?.sheetId;
}

function resolvePreferredDirectory(link) {
  if (!link || typeof link !== 'string') return null;

  const value = link.trim().replace(/^["']+|["']+$/g, '');
  if (!value) return null;

  let candidate = null;

  if (value.startsWith('file://')) {
    try {
      candidate = fileURLToPath(value);
    } catch {
      return null;
    }
  } else if (/^[a-zA-Z]:[\\/]/.test(value) || /^\\\\/.test(value)) {
    candidate = path.normalize(value);
  } else {
    return null;
  }

  try {
    if (existsSync(candidate)) {
      const stats = statSync(candidate);
      return stats.isDirectory() ? candidate : path.dirname(candidate);
    }

    const dirname = path.dirname(candidate);
    if (dirname && dirname !== candidate && existsSync(dirname) && statSync(dirname).isDirectory()) {
      return dirname;
    }
  } catch {
    return null;
  }

  return null;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200, height: 900,
    icon: path.join(__dirname, '../build/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // МАГИЯ СБОРКИ: проверяем, запаковано ли приложение
  if (app.isPackaged) {
    // В собранном .exe грузим статический файл из папки dist
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    // В режиме разработки грузим с локального сервера Vite
    mainWindow.loadURL('http://localhost:5173');
  }
  mainWindow.webContents.on('did-finish-load', () => {
    if (latestUpdateState) {
      mainWindow.webContents.send('update-status', latestUpdateState);
    }
  });
  mainWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
    console.log(`[renderer:${level}] ${message} (${sourceId}:${line})`);
  });
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error('Renderer load failed:', errorCode, errorDescription, validatedURL);
  });
  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error('Renderer process gone:', details);
  });
}

app.whenReady().then(() => {
  createWindow();
  setupVisualAutoUpdater();
  if (app.isPackaged) {
    setTimeout(() => {
      checkForAppUpdates();
    }, 1500);
  }
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('download-update', async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('install-update', async () => {
  try {
    autoUpdater.quitAndInstall();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-txt', async (event, { text, filename, preferredDir }) => {
  try {
    const resolvedDir = resolvePreferredDirectory(preferredDir);
    if (resolvedDir) {
      const targetPath = path.join(resolvedDir, filename);
      await writeFile(targetPath, `﻿${text}`, 'utf8');
      return { success: true, filePath: targetPath, autoSaved: true };
    }

    const saveResult = await dialog.showSaveDialog(mainWindow, {
      title: 'Сохранить ТЗ',
      defaultPath: filename,
      filters: [{ name: 'Text Files', extensions: ['txt'] }],
      properties: ['createDirectory', 'showOverwriteConfirmation'],
    });

    if (saveResult.canceled || !saveResult.filePath) {
      return { success: false, canceled: true };
    }

    await writeFile(saveResult.filePath, `﻿${text}`, 'utf8');
    return { success: true, filePath: saveResult.filePath, autoSaved: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-config-sheet', async () => {
  try {
    const sheets = createSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${CONFIG_SHEET_TITLE}'!A:B`,
    });

    const rows = response.data.values || [];
    const jsonRow = rows.find((row) => row[0] === 'dicts_json');
    const versionRow = rows.find((row) => row[0] === 'app_version');
    const rawJson = jsonRow?.[1] ?? rows[0]?.[0] ?? '';

    if (!rawJson?.trim()) {
      return { success: true, hasConfig: false };
    }

    return {
      success: true,
      hasConfig: true,
      config: JSON.parse(rawJson),
      appVersion: versionRow?.[1] || null,
    };
  } catch (error) {
    if (String(error?.message || '').includes('Unable to parse range')) {
      return { success: true, hasConfig: false };
    }
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-config-sheet', async (event, { config, appVersion }) => {
  try {
    const sheets = createSheetsClient();
    await ensureConfigSheet(sheets);

    const payload = JSON.stringify(config);
    const updatedAt = new Date().toISOString();
    const resolvedAppVersion = String(appVersion || '').trim() || null;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${CONFIG_SHEET_TITLE}'!A1:B4`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          ['dicts_json', payload],
          ['updated_at', updatedAt],
          ['source', 'desktop_app'],
          ['app_version', resolvedAppVersion],
        ],
      },
    });

    return { success: true, updatedAt, appVersion: resolvedAppVersion };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-client-store', async () => {
  try {
    const store = await loadClientStoreFromDisk();
    return { success: true, store };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-client-entry', async (event, { managerName, clientName }) => {
  try {
    return await upsertClientEntry(managerName, clientName);
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-preset-store', async () => {
  try {
    const store = await loadPresetStoreFromDisk();
    return { success: true, store };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-preset-entry', async (event, { managerName, presetName, presetData }) => {
  try {
    return await upsertPresetEntry(managerName, presetName, presetData);
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('send-to-sheet', async (event, { formData, shortTz, sheetName, managerMarker }) => {
  try {
    const sheets = createSheetsClient();
    const targetSheet = sheetName || 'Печать_2026';
    const normalizedManagerMarker = normalizeSheetCell(managerMarker);

    const [metaResponse, readResponse] = await Promise.all([
      sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID }),
      sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${targetSheet}'!A:Z`,
      }),
    ]);
    const sheetMeta = metaResponse.data.sheets?.find((sheet) => sheet.properties?.title === targetSheet);
    const sheetId = sheetMeta?.properties?.sheetId;
    const sheetRowCount = sheetMeta?.properties?.gridProperties?.rowCount || readResponse.data.values?.length || 0;

    const rows = readResponse.data.values || [];
    const totalRowsRequested = Math.max(0, Number.parseInt(String(formData?.cellBooking || '').replace(/[^\d]/g, ''), 10) || 0);
    const reservationCount = totalRowsRequested > 0 ? Math.max(0, totalRowsRequested - 1) : 0;
    const blockSize = totalRowsRequested > 0 ? totalRowsRequested : 1;
    const foundRowNumber = findAvailableBlock(rows, normalizedManagerMarker, blockSize, sheetRowCount);
    const rowNumber = foundRowNumber > 0 ? foundRowNumber : Math.max(sheetRowCount + 1, 2);
    const requiredRowCount = rowNumber + blockSize - 1;
    const existingMarker = getRowCell(rows[rowNumber - 1], 25);

    await ensureSheetRowCount(sheets, sheetId, sheetRowCount, requiredRowCount);

    const orderNumberFromA = rows[rowNumber - 1] ? rows[rowNumber - 1][0] : "???";

    const now = new Date();
    const creationCell = `${now.toLocaleDateString('ru-RU')}\n${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;

    const deadlineCell = buildDeadlineCell(formData);

  const columnEParts = [];
  if (formData.fileLink?.trim()) columnEParts.push(formData.fileLink.trim());
  if (shortTz?.trim()) columnEParts.push(shortTz.trim());
  columnEParts.push(`Тираж : ${formData.quantity ? `${formatQuantityCell(formData.quantity)} шт.` : '—'}`);
  const columnE = columnEParts.join('\n\n');

    const values = [
      formData.clientName,
      creationCell,
      deadlineCell,
      columnE,
      "", "", "", "", "",
      formData.managerName
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${targetSheet}'!B${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] },
    });

    if (normalizedManagerMarker && reservationCount > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${targetSheet}'!Z${rowNumber + 1}:Z${rowNumber + reservationCount}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: Array.from({ length: reservationCount }, () => [normalizedManagerMarker]),
        },
      });
    }

    if (normalizedManagerMarker && existingMarker === normalizedManagerMarker) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${targetSheet}'!Z${rowNumber}`,
        valueInputOption: 'RAW',
        requestBody: { values: [['']] },
      });
    }

    const requests = [];

    if (sheetId && formData.deadline && formData.deadline === getLocalIsoDate(now)) {
      requests.push({
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: rowNumber - 1,
            endRowIndex: rowNumber,
            startColumnIndex: 3,
            endColumnIndex: 4,
          },
          cell: {
            userEnteredFormat: {
              textFormat: {
                bold: true,
                fontSize: 12,
              },
            },
          },
          fields: 'userEnteredFormat.textFormat.bold,userEnteredFormat.textFormat.fontSize',
        },
      });
    }

    if (sheetId && columnE.includes('УФ-лак')) {
      requests.push({
        updateCells: {
          range: {
            sheetId,
            startRowIndex: rowNumber - 1,
            endRowIndex: rowNumber,
            startColumnIndex: 4,
            endColumnIndex: 5,
          },
          rows: [
            {
              values: [
                {
                  userEnteredValue: { stringValue: columnE },
                  textFormatRuns: buildOrangeRuns(columnE),
                },
              ],
            },
          ],
          fields: 'userEnteredValue,textFormatRuns',
        },
      });
    }

    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { requests },
      });
    }

    return { success: true, orderNumber: orderNumberFromA };

  } catch (error) {
    console.error('ОШИБКА:', error.message);
    return { success: false, error: error.message };
  }
});
