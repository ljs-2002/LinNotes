import { BrowserWindow } from 'electron'
import { resolve } from 'path'

export function createMainWindow({ width, height, show, preload_dir, devTools, loadFile, ico }) {
    let mainWindow = new BrowserWindow({
        width: width,
        height: height,
        show: show,
        icon: ico,
        webPreferences: {
            sandbox: false,
            preload: resolve(preload_dir, 'preload.mjs'),
        }
    })
    mainWindow.loadURL(loadFile)
    if (devTools) {
        mainWindow.webContents.openDevTools()
    }
    mainWindow.on('minimize', (event) => {
        event.preventDefault()
        mainWindow.hide()
    })
    mainWindow.on('close', (event) => {
        event.preventDefault()
        mainWindow.hide()
    })
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    return mainWindow
}

export function createNotesWindow(loadFile, windowMap, preload_dir, handleClose) {
    let notes = new BrowserWindow({
        width: 320,
        height: 240,
        show: false,
        frame: false,
        webPreferences: {
            sandbox: false,
            preload: resolve(preload_dir, 'preload.mjs')
        }
    })
    // notes.loadFile(loadFile)
    notes.loadURL(loadFile)
    notes.once('ready-to-show', () => {
        notes.show()
    })
    if (process.env.NODE_ENV === 'development'){
        notes.webContents.openDevTools()
    }
    notes.once('close', (event) => {
        event.preventDefault()
        notes.close()
        handleClose(notes.webContents.id)
    })
    notes.once('minimize', (event) => {
        event.preventDefault()
        notes.close()
        handleClose(notes.webContents.id)
    })
    windowMap.set(notes.webContents.id, notes)
    return notes
}

export function createModelWindow(loadFile, parent, windowMap) {
    let model = new BrowserWindow({
        width: 400,
        height: 300,
        show: false,
        parent: parent,
        modal: true,
    })
    model.loadFile(loadFile)
    model.once('ready-to-show', () => {
        model.show()
    })
    model.once('closed', () => {
        windowMap.delete(model.id)
        console.log(`delete model with id ${model.id}`)
        console.log(windowMap)
        model = null
    })
    windowMap.set(model.id, model)
    console.log(`create model with id ${model.id}`)
    console.log(windowMap)
    return model
}

export function getWindowId() {
    return BrowserWindow.getFocusedWindow().webContents.id
}