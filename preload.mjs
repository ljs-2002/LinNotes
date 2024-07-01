import { ipcRenderer, contextBridge } from 'electron'
//新建或关闭窗口
contextBridge.exposeInMainWorld('WindowOption', {
    CreateNotesWindow: async (note_id) => {
        const id = await ipcRenderer.invoke('create-notes-window',note_id)
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
    DeleteWindow: (note_id) => {
        ipcRenderer.invoke('delete-window', note_id)
    },
    ToggleAlwaysOnTop: (id) => {
        ipcRenderer.invoke('always-top', id)
    },
    Minimize: (id) => {
        ipcRenderer.invoke('minimize', id)
    },
})

contextBridge.exposeInMainWorld('NoteOption', {
    SaveNotes: (key, title, create_time, content) => {
        //Note通知主进程保存
        ipcRenderer.invoke('save-notes', key, title, create_time, content)
    },
    HandleSaveNote: (func)=>{
        ipcRenderer.on('save-notes', (event, key, title, create_time, content) => {
            func(key, title, create_time, content)
        })
    },
    RequireNoteContent: (note_id) => {
        ipcRenderer.invoke('require-note-content', note_id)
    },
    HandleRequireNoteContent: (func) => {
        ipcRenderer.on('require-note-content', (event, note_id, senderID) => {
            func(note_id, senderID)
        })
    },
    ReplyNotesContent: (note_window_id,content) => {
        ipcRenderer.invoke('reply-notes-content', note_window_id,content)
    },
    HandleNotesContent: (func) => {
        ipcRenderer.on('reply-notes-content', (event, note) => {
            func(note)
        })
    },
    HandleShortCutCreateNote: (func) => {
        ipcRenderer.on('shortcut-create-note', (event) => {
            func()
        })

    }
})

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        on: (channel, func) => ipcRenderer.on(channel, func)
    }
});