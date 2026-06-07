const { contextBridge, ipcRenderer } = require('electron');

// Создаем мостик
contextBridge.exposeInMainWorld('electronAPI', {
  sendToSheet: (data) => ipcRenderer.invoke('send-to-sheet', data),
  saveTxt: (data) => ipcRenderer.invoke('save-txt', data),
  loadConfigSheet: () => ipcRenderer.invoke('load-config-sheet'),
  saveConfigSheet: (data) => ipcRenderer.invoke('save-config-sheet', data),
  loadClientStore: () => ipcRenderer.invoke('load-client-store'),
  saveClientEntry: (data) => ipcRenderer.invoke('save-client-entry', data),
});
