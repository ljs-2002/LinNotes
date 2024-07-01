import { Menu } from 'electron'
import {createModelWindow } from './window.js'

const settings_path = './renderer/settings.html'

export function createMainMenu(mainWindow,windowMap){
    const mainMenuTamplate = [
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
