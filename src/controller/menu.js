import { Menu } from 'electron'
import { createNotesWindow, createModelWindow } from './window.js'

const notes_path = './renderer/Notes.html'
const settings_path = './renderer/settings.html'

export function createMainMenu(mainWindow,windowMap){
    const mainMenuTamplate = [
        {
            label: 'Notes',
            submenu: [
                {
                    label: 'New Notes',
                    accelerator: 'CmdOrCtrl+N',
                    click() {
                        createNotesWindow(notes_path,windowMap)
                    }
                },
            ]
        },
        {
            label: 'Settings',
            submenu:[
                {
                    label: 'Settings',
                    accelerator: 'CmdOrCtrl+,',
                    click() {
                        createModelWindow(settings_path,mainWindow,windowMap)
                    }
                }
            ]
        }
    ]
    return Menu.buildFromTemplate(mainMenuTamplate)
}
