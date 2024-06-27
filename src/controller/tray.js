import { Tray, Menu, dialog, app } from 'electron'
import { closeAllWindows } from './util.js'
/*
* 创建托盘
*/
export function createTray(mainWindow,icon,tip){
    let trayMenu = Menu.buildFromTemplate([
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
    ])
    const tray = new Tray(icon)
    tray.setContextMenu(trayMenu)
    tray.setToolTip(tip)
    tray.on('click', () => {
        // 如果主窗口已经存在并且是隐藏状态，就显示它
        if (mainWindow && mainWindow.isVisible() === false){
          mainWindow.show();
        } else if (mainWindow) { // 如果主窗口已存在但不是最小化状态，就将其置于前端
          mainWindow.focus();
        }
      });
    
    return tray
}