const { ipcRenderer, contextBridge } = require('electron')

//新建或关闭窗口
contextBridge.exposeInMainWorld('WindowOption', {
    CreateNotesWindow: async (create_time) => {
        const id = await ipcRenderer.invoke('create-notes-window',create_time)
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

contextBridge.exposeInMainWorld('NoteOption', {
    GetNotes: async (key) => {
        //Note请求主进程
        const id = await ipcRenderer.invoke('get-window-id')
        const content = await ipcRenderer.invoke('get-notes', key, id)
        return content
    },
    SendNotes: async (key) => {
        //Home送回主进程
        const content = await ipcRenderer.invoke('send-notes', key)
        return content
    },
    SaveNotes: (key, title, create_time, content) => {
        //Note通知主进程保存
        ipcRenderer.invoke('save-notes', key, title, create_time, content)
    }
})

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        on: (channel, func) => ipcRenderer.on(channel, func)
    }
});