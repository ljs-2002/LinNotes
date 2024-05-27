const {app,ipcMain} = require('electron/main')
const {createMainWindow,createNotesWindow,createModelWindow,getWindowId} = require('./src/window.js')
const {createMainMenu} = require('./src/menu.js')

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
    mainWindow = createMainWindow(800, 600, false, __dirname, true, './renderer/mainPage.html')
    mainWindow.setMenu(createMainMenu(mainWindow,windowMap))
    mainWindowId = mainWindow.id
    windowMap.set(mainWindowId, mainWindow)
    mainWindow.on('closed', () => {
        // 将 mainWindow 设置为 null
        windowMap.delete(mainWindowId)
        mainWindow = null;
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})