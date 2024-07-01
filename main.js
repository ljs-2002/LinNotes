import { app, ipcMain } from 'electron'
import { join, dirname } from 'path'
import { createMainWindow, createNotesWindow, createModelWindow, getWindowId } from './src/controller/window.js'
import { createMainMenu } from './src/controller/menu.js'
import { createTray } from './src/controller/tray.js'
import { MAIN_WINDOW_PARAM, NOTES_PRELOAD_DIR, NOTES_LOAD_FILE } from './src/config/param.js'

const windowMap = new Map()
const notesMap = new Map()
let mainWindow = null
let mainWindowId = 0

app.whenReady().then(() => {
    ipcMain.handle('create-notes-window', (event,create_time) => {
        if (notesMap.has(create_time) && windowMap.has(notesMap.get(create_time))){
            return null
        }
        const handleClose = (id) => {
            windowMap.delete(id)
        }
        console.log(`${NOTES_LOAD_FILE}/${create_time}`)
        let win = createNotesWindow(`${NOTES_LOAD_FILE}/${create_time}`, windowMap, NOTES_PRELOAD_DIR,handleClose)

        windowMap.set(win.webContents.id, win)
        notesMap.set(create_time, win.webContents.id)
        return win.webContents.id
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
    mainWindowId = mainWindow.webContents.id
    windowMap.set(mainWindowId, mainWindow)

    //创建托盘
    let icon_path;
    if (process.env.NODE_ENV === 'development') {
        icon_path = './public/icon.png'
    }else{
        icon_path = join(dirname(app.getPath('exe')), './resources/public/icon.png');
    }
    let tray = createTray(mainWindow, icon_path, 'LinNotes')
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})