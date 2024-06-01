const {app,ipcMain} = require('electron/main')
const {createMainWindow,createNotesWindow,createModelWindow,getWindowId} = require('./src/window.js')
const {createMainMenu} = require('./src/menu')
const {createTray} = require('./src/tray')
const {MAIN_WINDOW_PARAM} = require('./config/param')

const windowMap = new Map()
let mainWindow = null
let mainWindowId = 0

app.whenReady().then(() => {
    ipcMain.handle('create-notes-window', () => {
        win = createNotesWindow('./renderer/Notes.html',windowMap)
        windowMap.set(win.id, win)
        return win.id
    })
    ipcMain.handle('create-model-window', () => {
        win = createModelWindow('./renderer/settings.html',mainWindow,windowMap)
        windowMap.set(win.id, win)
        return win.id
    })
    ipcMain.handle('get-window-id', (event) => {
        return getWindowId()
    })
    ipcMain.handle('open-window', (event,id) => {
        let win = windowMap.get(id)
        win.show()
    })
    ipcMain.handle('delete-window', (event,id) => {
        let win = windowMap.get(id)
        win.removeAllListeners('close')
        win.close()
        windowMap.delete(id)
        win=null
    })
    //创建主页面
    mainWindow = createMainWindow(MAIN_WINDOW_PARAM)
    mainWindow.setMenu(createMainMenu(mainWindow,windowMap))
    mainWindowId = mainWindow.id
    windowMap.set(mainWindowId, mainWindow)

    //创建托盘
    let tray = createTray(mainWindow, './assets/icon.png', 'LinNotes')
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})