import { BrowserWindow } from 'electron'
/*
* 关闭所有窗口
*/
export function closeAllWindows() {
    let allWindow = BrowserWindow.getAllWindows()
    allWindow.forEach((win) => {
        win.removeAllListeners('close') // 移除之前的监听器
        win.close()
    })
}