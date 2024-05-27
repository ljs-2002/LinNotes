const {ipcRenderer, contextBridge} = require('electron')

//新建或关闭窗口
contextBridge.exposeInMainWorld('WindowOption', {
    CreateNotesWindow: () => {
        ipcRenderer.invoke('create-notes-window')
    },
    CreateModelWindow: () => {
        ipcRenderer.invoke('create-model-window')
    },
    GetWindowId:async() => {
        const id = await ipcRenderer.invoke('get-window-id')
        return id
    },
    CloseWindow: (id) => {
        ipcRenderer.invoke('close-window',id)
    }
})