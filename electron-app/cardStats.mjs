/**
 * Чистая логика статистики карточек успеха (без Electron и Google API),
 * чтобы её можно было проверять тестами.
 *
 * Формат листа `__CARD_STATS__`:
 *  - построчная запись (все карточки с 2.7.8): [дата, менеджер, карточка]
 *  - исторические сводки до 2.7.8:              ['ИТОГО', карточка, количество]  — без менеджера
 */

export function normalizeSheetCell(value) {
  return String(value ?? '').trim();
}

export function getRowCell(row, index) {
  return normalizeSheetCell(Array.isArray(row) ? row[index] : '');
}

/**
 * Строка для записи в лист: КАЖДАЯ карточка пишется отдельной строкой с именем
 * менеджера. Раньше обычные карточки писались сводкой ['ИТОГО', картинка, N] без
 * менеджера — из-за этого их нельзя было привязать к альбому, и в альбоме
 * показывались только редкие.
 */
export function buildCardStatRow({ managerName, imageName, date = new Date().toISOString() }) {
  return [date, normalizeSheetCell(managerName) || 'Не указан', normalizeSheetCell(imageName)];
}

/**
 * Свод по строкам листа. `byImage` учитывает и построчные записи, и старые
 * сводки «ИТОГО»; `byManager` строится ТОЛЬКО по построчным записям, потому что
 * в сводках имя менеджера не хранится.
 */
export function aggregateCardStats(rows) {
  const byImage = {};
  const byManager = {};
  (rows || []).forEach((row, index) => {
    if (index === 0 && getRowCell(row, 0).toLowerCase() === 'дата') return;
    if (getRowCell(row, 0).toUpperCase() === 'ИТОГО') {
      const image = getRowCell(row, 1);
      const count = Number.parseInt(getRowCell(row, 2), 10) || 0;
      if (image && count > 0) byImage[image] = (byImage[image] || 0) + count;
      return;
    }
    const manager = getRowCell(row, 1) || 'Не указан';
    const image = getRowCell(row, 2);
    if (!image) return;
    byImage[image] = (byImage[image] || 0) + 1;
    byManager[manager] = { ...(byManager[manager] || {}), [image]: (byManager[manager]?.[image] || 0) + 1 };
  });
  return { byImage, byManager };
}
