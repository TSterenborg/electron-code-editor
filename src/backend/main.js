const { app, BrowserWindow, ipcMain, dialog } = require("electron/main")
const path = require("node:path")

const { getFolderContent } = require("./scripts/functions");

function createWindow () {
    let win = new BrowserWindow({
        width: 1200,
        height: 600,
        minWidth: 1200,
        minHeight: 600,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "../frontend/preload.js")
        }
    })

    win.setMenuBarVisibility(false)
    win.loadFile(path.join(__dirname, "../frontend/index.html"))
}

app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

// Handle: Explorer

ipcMain.handle("explorer:open-project", async () => {
    const result = await dialog.showOpenDialog({
        properties: ["openDirectory"]
    });

    if (result.canceled) return [];

    const folderPath = result.filePaths[0];
    return getFolderContent(folderPath);
});

ipcMain.handle("explorer:get-folder-content", async (event, folderPath) => {
    return getFolderContent(folderPath);
});