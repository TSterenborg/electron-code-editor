const { app, BrowserWindow, ipcMain, dialog } = require("electron/main")
const path = require("node:path")
const fs = require("fs")
const fsp = require("fs/promises");

const { getFolderContent } = require("./scripts/functions");

let win;

function createWindow () {
    win = new BrowserWindow({
        width: 1200,
        height: 600,
        minWidth: 1200,
        minHeight: 600,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "../frontend/preload.js")
        }
    })

    win.on("maximize", () => {win.webContents.send("updateMaximizeButton", true)})
    win.on("unmaximize", () => {win.webContents.send("updateMaximizeButton", false)});

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

// Handle: Window

ipcMain.on("winMinimize", () => {
    win.minimize();
});

ipcMain.on("winMaximize", () => {
    if (win.isMaximized()) {
        win.restore();
    } else {
        win.maximize();
    }
});

ipcMain.on("winClose", () => {
    app.quit();
});

// Handle: Explorer

ipcMain.handle("explorer:open-project", async () => {
    const result = await dialog.showOpenDialog({
        properties: ["openDirectory"]
    });

    if (result.canceled) return null;

    const folderPath = result.filePaths[0];
    const folderName = path.basename(folderPath);
    const folderContent = await getFolderContent(folderPath);

    return { folderName, folderContent };
});


ipcMain.handle("explorer:get-folder-content", async (event, folderPath) => {
    return getFolderContent(folderPath);
});

// Handle: Editor

ipcMain.handle("editor:read-file", async (event, filePath) => {
    try {
        const content = fs.readFileSync(filePath, "utf-8");
        return content;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
});

ipcMain.handle("editor:save-file", async (event, { path: filePath, content }) => {
    try {
        await fsp.writeFile(filePath, content, "utf8");
        return true;
    } catch (error) {
        console.error(`Failed to save file: ${error.message}`);
        throw error;
    }
});