const {app,ipcMain} = require('electron/main')
const {createMainWindow,createNotesWindow,createModelWindow,getWindowId} = require('./src/window.js')
const {createMainMenu} = require('./src/menu')
const {createTray} = require('./src/tray')
const {MAIN_WINDOW_PARAM} = require('./config/param')

const windowMap = new Map()
let mainWindow = null
let mainWindowId = 0

app.whenReady().then(() => {
    ipcMain.on('create-notes-window', () => {
        console.log('recive create-notes-window')
        win = createNotesWindow('./renderer/Notes.html')
        windowMap.set(win.id, win)
    })
    ipcMain.on('create-model-window', () => {
        console.log('recive create-model-window')
        win = createModelWindow('./renderer/settings.html',mainWindow)
        windowMap.set(win.id, win)
    })
    ipcMain.handle('get-window-id', (event) => {
        return getWindowId()
    })
    ipcMain.on('close-window', (id) => {
        let win = windowMap.get(id)
        windowMap.delete(id)
        win.close()
        win=null
    })
    //创建主页面
    mainWindow = createMainWindow(MAIN_WINDOW_PARAM)
    mainWindow.setMenu(createMainMenu(mainWindow,windowMap))
    mainWindowId = mainWindow.id
    windowMap.set(mainWindowId, mainWindow)
    mainWindow.on('minimize', (event) => {
        event.preventDefault()
        mainWindow.hide()
    })
    mainWindow.on('close', (event) => {
        event.preventDefault()
        mainWindow.hide()
    })

    //创建托盘
    let tray = createTray(mainWindow, './assets/icon.png', 'LinNotes')
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})