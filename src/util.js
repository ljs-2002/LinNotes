const {BrowserWindow} = require('electron/main')

/*
* 关闭所有窗口
*/
function closeAllWindows() {
    allWindow = BrowserWindow.getAllWindows()
    allWindow.forEach((win) => {
        win.close()
    })
}

module.exports = {
    closeAllWindows
}