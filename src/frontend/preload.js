const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    openProject: () => ipcRenderer.invoke("explorer:open-project"),
    getFolderContent: (folderPath) => ipcRenderer.invoke("explorer:get-folder-content", folderPath),
});