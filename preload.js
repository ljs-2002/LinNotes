const { ipcRenderer, contextBridge } = require('electron')

//新建或关闭窗口
contextBridge.exposeInMainWorld('WindowOption', {
    CreateNotesWindow: async () => {
        const id = await ipcRenderer.invoke('create-notes-window')
        return id
    },
    CreateModelWindow: async () => {
        const id = await ipcRenderer.invoke('create-model-window')
        return id
    },
    GetWindowId: async () => {
        const id = await ipcRenderer.invoke('get-window-id')
        return id
    },
    OpenWindow: (id) => {
        ipcRenderer.invoke('open-window', id)
    },
    DeleteWindow: (id) => {
        ipcRenderer.invoke('delete-window', id)
    },
    ToggleAlwaysOnTop: (id) => {
        ipcRenderer.invoke('always-top', id)
    },
    Minimize: (id) => {
        ipcRenderer.invoke('minimize', id)
    }
})