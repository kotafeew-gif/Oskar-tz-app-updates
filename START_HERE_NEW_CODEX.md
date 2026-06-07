# START HERE FOR NEW CODEX

Если ты новый аккаунт Codex и продолжаешь работу по этому проекту, начни с этого порядка:

1. Открой и полностью прочитай файл [HANDOFF.md](D:/AI/prog/printing%20%20test/HANDOFF.md).
2. Считай `HANDOFF.md` основным источником контекста по проекту.
3. Работай только в папке `D:\AI\prog\printing  test`.
4. Папку `D:\AI\prog\printing` используй только как reference для сравнения, не вноси туда изменения.
5. Перед любыми крупными правками открой:
   - [src/App.tsx](D:/AI/prog/printing%20%20test/src/App.tsx)
   - [electron-app/main.mjs](D:/AI/prog/printing%20%20test/electron-app/main.mjs)
   - [package.json](D:/AI/prog/printing%20%20test/package.json)
6. Если правки касаются справочников, обязательно учитывай механику скрытого листа `__CONFIG__`, описанную в `HANDOFF.md`.
7. После изменений обязательно проверяй:
   - `npm run build`
   - `npm run dist`

Коротко о проекте:

- Это `Electron + React + Vite`.
- Почти вся логика формы находится в `src/App.tsx`.
- Справочники синхронизируются через скрытый лист Google Sheets `__CONFIG__`.
- Текущий релиз и актуальное состояние проекта описаны в `HANDOFF.md`.

Главное правило:

- Не начинай работу “с нуля по догадке”.
- Сначала прочитай `HANDOFF.md`, и только потом вноси изменения.

