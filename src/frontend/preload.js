const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, callback),

    openProject: () => ipcRenderer.invoke("explorer:open-project"),
    getFolderContent: (folderPath) => ipcRenderer.invoke("explorer:get-folder-content", folderPath),
    
    readFile: (filePath) => ipcRenderer.invoke("editor:read-file", filePath),
    saveFile: (path, content) => ipcRenderer.invoke("editor:save-file", {path, content}),
});