const {BrowserWindow} = require('electron')


function createMainWindow({width, height, show, preload_dir, devTools, loadFile, ico}) {
    let mainWindow = new BrowserWindow({
        width: width,
        height: height,
        show: show,
        icon: ico,
        webPreferences: {
            preload: preload_dir + '/preload.js',
        }
    })
    mainWindow.loadFile(loadFile)
    if (devTools){
        mainWindow.webContents.openDevTools()
    }
    mainWindow.once('ready-to-show',()=>{
        mainWindow.show()
    })
    return mainWindow
}

function createNotesWindow(loadFile,windowMap){
    let notes = new BrowserWindow({
        width: 240,
        height: 180,
        show: false,
    })
    notes.loadFile(loadFile)
    notes.once('ready-to-show',()=>{
        notes.show()
    })
    notes.once('closed',()=>{
        windowMap.delete(notes.id)
        console.log(`delete notes with id ${notes.id}`)
        console.log(windowMap)
        notes = null
    })
    windowMap.set(notes.id, notes)
    console.log(`create notes with id ${notes.id}`)
    console.log(windowMap)
    return notes
}

function createModelWindow(loadFile,parent,windowMap){
    let model = new BrowserWindow({
        width: 400,
        height: 300,
        show: false,
        parent: parent,
        modal: true,
    })
    model.loadFile(loadFile)
    model.once('ready-to-show',()=>{
        model.show()
    })
    model.once('closed',()=>{
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

function getWindowId(){
    return BrowserWindow.getFocusedWindow().id
}

module.exports = {
    createMainWindow,
    createNotesWindow,
    createModelWindow,
    getWindowId
}