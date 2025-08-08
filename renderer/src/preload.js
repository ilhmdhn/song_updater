const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onLogUpdate: (callback) => ipcRenderer.on('update-error-log', (event, data) => callback(data)),
    currentOutletCode: (callback) => ipcRenderer.on('current-outlet-code', (event, data) => callback(data)),
    updateAvailableList: (callback) => ipcRenderer.on('update-available-list', (event, data) => callback(data)),
    addSongItemList: (callback) => ipcRenderer.on('add-song-item-list', (event, data) => callback(data)),
    sendOutletCode: (data) => ipcRenderer.send('send-outlet-code', data),
    updateDownloadProgress: (callback) => ipcRenderer.on('SEND-DOWNLOAD-PROGRESS', (event, data) => callback(data)),
    updateMovingQueueState: (callback) => ipcRenderer.on('SEND-MOVE-QUEUE', (event, data) => callback(data)),
    sendProgressMain: (callback) => ipcRenderer.on('SEND-MOVE_PROGRESS_MAIN', (event, data) => callback(data)),
});