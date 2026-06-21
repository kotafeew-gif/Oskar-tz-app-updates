const { contextBridge, ipcRenderer } = require('electron');

// Создаем мостик
contextBridge.exposeInMainWorld('electronAPI', {
  sendToSheet: (data) => ipcRenderer.invoke('send-to-sheet', data),
  reserveRow: (data) => ipcRenderer.invoke('reserve-row', data),
  saveTxt: (data) => ipcRenderer.invoke('save-txt', data),
  loadConfigSheet: () => ipcRenderer.invoke('load-config-sheet'),
  saveConfigSheet: (data) => ipcRenderer.invoke('save-config-sheet', data),
  loadClientStore: () => ipcRenderer.invoke('load-client-store'),
  saveClientEntry: (data) => ipcRenderer.invoke('save-client-entry', data),
  loadPresetStore: () => ipcRenderer.invoke('load-preset-store'),
  savePresetEntry: (data) => ipcRenderer.invoke('save-preset-entry', data),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  onUpdateStatus: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on('update-status', handler);
    return () => ipcRenderer.removeListener('update-status', handler);
  },
});
