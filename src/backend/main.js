const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

function createWindow () {
    let win = new BrowserWindow({
        width: 1200,
        height: 600,
        minWidth: 1200,
        minHeight: 600,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, '../frontend/preload.js')
        }
    })

    win.setMenuBarVisibility(false)
    win.loadFile(path.join(__dirname, '../frontend/index.html'))
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})