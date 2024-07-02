import {app, BrowserWindow, ipcMain, globalShortcut, screen} from 'electron'
import {join, dirname} from 'path'
import { createMainWindow, createNotesWindow, createModelWindow, getWindowId } from './src/controller/window.js'
import { createMainMenu, createDockMenu } from './src/controller/menu.js'
import { createTray } from './src/controller/tray.js'
import { MAIN_WINDOW_PARAM, NOTES_PRELOAD_DIR, NOTES_LOAD_FILE } from './src/config/param.js'
const windowMap = new Map()
const notesMap = new Map()
const MIN_INTERVAL = 100;
let mainWindow = null
let mainWindowId = 0
let lastShortcutTime = 0;

function handleCreateNotesWindow(create_time) {
    if (notesMap.has(create_time) && windowMap.has(notesMap.get(create_time))){
        return null
    }
    const handleClose = (id) => {
        windowMap.delete(id)
    }
    let x,y
    const currentWindow = BrowserWindow.getFocusedWindow();　//获取当前活动的浏览器窗口。

    //如果当前活动的浏览器窗口不是Note窗口，就在屏幕中间打开Note窗口
    if (currentWindow === null || currentWindow === mainWindow || !windowMap.has(currentWindow.webContents.id)){
        const {width, height} = screen.getPrimaryDisplay().workAreaSize
        x = (width - 320) / 2
        y = (height - 240) / 2
    }
    //如果当前活动的浏览器窗口是Note窗口，就在当前Note窗口的右下角打开Note窗口
    else{
        const bounds = currentWindow.getBounds()
        x = bounds.x + bounds.width + 10
        y = bounds.y + bounds.height + 10
        //若超出屏幕右下角，就在从屏幕左上角重新开始
        if (x + 320 > screen.getPrimaryDisplay().workAreaSize.width){
            x = 0
            y = 0
        }
    }
    let win = createNotesWindow(`${NOTES_LOAD_FILE}/${create_time}`, windowMap, NOTES_PRELOAD_DIR,handleClose,x,y)

    windowMap.set(win.webContents.id, win)
    notesMap.set(create_time, win.webContents.id)
    if (process.platform === 'darwin'){
        const num = windowMap.size-1
        if (num > 0)
            app.dock.setBadge(num.toString())
        else
            app.dock.setBadge('')
    }
    return win.webContents.id
}

app.whenReady().then(() => {
    ipcMain.handle('create-notes-window', (event,create_time) => {
        return handleCreateNotesWindow(create_time)
    })
    ipcMain.handle('require-note-content', (event, noteID) => {
        const senderID = event.sender.id
        mainWindow.webContents.send('require-note-content', noteID, senderID)
    })
    ipcMain.handle('reply-notes-content', (event, note_window_id, note) => {
        let win = windowMap.get(note_window_id)
        win.webContents.send('reply-notes-content', note)
    })
    ipcMain.handle('save-notes', (event, key, title, create_time, content) => {
        mainWindow.webContents.send('save-notes', key, title, create_time, content)
    })
    ipcMain.handle('check-todo', (event, key, content) => {
        mainWindow.webContents.send('check-todo', key, content)
    })
    ipcMain.handle('create-model-window', () => {
        let win = createModelWindow('./renderer/settings.html', mainWindow, windowMap)
        windowMap.set(win.webContents.id, win)
        return win.webContents.id
    })
    ipcMain.handle('get-window-id', () => {
        return getWindowId()
    })
    ipcMain.handle('open-window', (event, id) => {
        let win = windowMap.get(id)
        win.show()
    })
    ipcMain.handle('delete-window', (event, note_id) => {
        const id = notesMap.get(note_id)
        notesMap.delete(note_id)
        if (windowMap.has(id)) {
            let win = windowMap.get(id)
            win.removeAllListeners('close')
            win.close()
            windowMap.delete(id)
            win = null
        }
        if (process.platform === 'darwin'){
            const num = windowMap.size-1
            if (num > 0)
                app.dock.setBadge(num.toString())
            else
                app.dock.setBadge('')
        }
    })
    ipcMain.handle('always-top', (event, id) => {
        let win = windowMap.get(id)
        win.setAlwaysOnTop(!win.isAlwaysOnTop())
    })
    ipcMain.handle('minimize', (event, id) => {
        let win = windowMap.get(id)
        win.minimize()
        windowMap.delete(id)
        if (process.platform === 'darwin'){
            const num = windowMap.size-1
            if (num > 0)
                app.dock.setBadge(num.toString())
            else
                app.dock.setBadge('')
        }
    })
    //创建主页面
    mainWindow = createMainWindow(MAIN_WINDOW_PARAM)
    mainWindow.setMenu(createMainMenu(mainWindow, windowMap))
    mainWindowId = mainWindow.webContents.id
    windowMap.set(mainWindowId, mainWindow)
    //mac Dock图标和菜单
    if (process.platform === 'darwin'){
        app.dock.setMenu(createDockMenu(mainWindow))
    }


    //创建托盘
    let icon_path;
    if (process.env.NODE_ENV === 'development') {
        if(process.platform === 'darwin')
            icon_path = './public/icon16.png'
        else
            icon_path = './public/icon.png'
    }else{
        if(process.platform === 'darwin'){
            icon_path = join(process.resourcesPath, 'icon16.png')
        }
        else
            icon_path = join(dirname(app.getPath('exe')), './resources/public/icon.png');
    }
    let tray = createTray(mainWindow, icon_path, 'LinNotes')

    //注册全局快捷键
    globalShortcut.register('CommandOrControl+=', () => {
        const now = Date.now();
        if (now - lastShortcutTime >= MIN_INTERVAL) {
            mainWindow.webContents.send('shortcut-create-note');
            lastShortcutTime = now;
        }
    })
}).catch(error=>{
    console.error(error)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (process.platform === 'darwin') {
        if (BrowserWindow.getAllWindows().length === 0) {
            windowMap.clear()
            mainWindow = createMainWindow(MAIN_WINDOW_PARAM)
            mainWindow.setMenu(createMainMenu(mainWindow, windowMap))
            mainWindowId = mainWindow.webContents.id
            windowMap.set(mainWindowId, mainWindow)
        }else{
            mainWindow.show();
        }
    }
})