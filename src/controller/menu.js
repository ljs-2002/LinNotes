import {app, dialog, Menu} from 'electron'
import {createModelWindow } from './window.js'
import {closeAllWindows} from "./util.js";

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

export function createDockMenu(mainWindow){
    const dockMenuTamplate = [
        {
            label: 'Quit',
            click: () => {
                //询问是否退出
                dialog.showMessageBox({
                    type: 'question',
                    message: 'Are you sure to quit?',
                    buttons: ['Yes', 'No']
                }).then((res) => {
                    if (res.response === 0) {
                        closeAllWindows()
                        app.quit()
                    }
                })
            }
        },
        {
            label: 'Show',
            click: () => {
                mainWindow.show()
            }
        }
    ]
    return Menu.buildFromTemplate(dockMenuTamplate)
}