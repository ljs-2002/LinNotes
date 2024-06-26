const { app, ipcMain } = require('electron/main')
const { createMainWindow, createNotesWindow, createModelWindow, getWindowId } = require('./src/controller/window')
const { createMainMenu } = require('./src/controller/menu')
const { createTray } = require('./src/controller/tray')
const { MAIN_WINDOW_PARAM, NOTES_PRELOAD_DIR } = require('./src/config/param')

const windowMap = new Map()
let mainWindow = null
let mainWindowId = 0

app.whenReady().then(() => {
    ipcMain.handle('create-notes-window', (event,create_time) => {
        // win = createNotesWindow(`http://localhost:4000/test${windowMap.size}/`, windowMap, NOTES_PRELOAD_DIR)
        let win = createNotesWindow(`http://localhost:4000/notes/${create_time}/`, windowMap, NOTES_PRELOAD_DIR)
        // win = createNotesWindow('./dist/notes/index.html',windowMap,NOTES_PRELOAD_DIR)
        windowMap.set(win.id, win)
        return win.id
    })
    ipcMain.handle('save-notes', (event, key, title, create_time, content) => {
        mainWindow.webContents.send('save-notes', key, title, create_time, content)
    })
    ipcMain.handle('create-model-window', () => {
        let win = createModelWindow('./renderer/settings.html', mainWindow, windowMap)
        windowMap.set(win.id, win)
        return win.id
    })
    ipcMain.handle('get-window-id', () => {
        return getWindowId()
    })
    ipcMain.handle('open-window', (event, id) => {
        let win = windowMap.get(id)
        win.show()
    })
    ipcMain.handle('delete-window', (event, id) => {
        let win = windowMap.get(id)
        win.removeAllListeners('close')
        win.close()
        windowMap.delete(id)
        win = null
    })
    ipcMain.handle('always-top', (event, id) => {
        let win = windowMap.get(id)
        win.setAlwaysOnTop(!win.isAlwaysOnTop())
    })
    ipcMain.handle('minimize', (event, id) => {
        let win = windowMap.get(id)
        win.minimize()
    })
    //创建主页面
    mainWindow = createMainWindow(MAIN_WINDOW_PARAM)
    mainWindow.setMenu(createMainMenu(mainWindow, windowMap))
    mainWindowId = mainWindow.id
    windowMap.set(mainWindowId, mainWindow)

    //创建托盘
    let tray = createTray(mainWindow, './src/assets/icon.png', 'LinNotes')
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})