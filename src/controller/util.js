const {BrowserWindow} = require('electron/main')

/*
* 关闭所有窗口
*/
function closeAllWindows() {
    allWindow = BrowserWindow.getAllWindows()
    allWindow.forEach((win) => {
        win.removeAllListeners('close') // 移除之前的监听器
        win.close()
    })
}

module.exports = {
    closeAllWindows
}