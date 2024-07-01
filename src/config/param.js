import { fileURLToPath } from 'url';
import { dirname,resolve,join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootPath = resolve(__dirname, '../..');
const preloadPath = resolve(__dirname, '../..');

// 主窗口参数
const MAIN_WINDOW_WIDTH = 300
const MAIN_WINDOW_HEIGHT = 500
const MAIN_WINDOW_SHOW = false
// const MAIN_WINDOW_PRELOAD_DIR = rootPath
const MAIN_WINDOW_PRELOAD_DIR = preloadPath
const MAIN_WINDOW_DEVTOOLS = process.env.NODE_ENV === 'development'
const MAIN_WINDOW_LOAD_FILE_DEV = 'http://localhost:4000#home/'
const MAIN_WINDOW_LOAD_FILE = `file://${join(rootPath, 'dist/index.html')}#/home`
const MAIN_WINDOW_ICON = join(rootPath,'/assets/icon.png')

let main_load_file;
if (process.env.NODE_ENV === 'development') {
    main_load_file = MAIN_WINDOW_LOAD_FILE_DEV
}
else {
    main_load_file = MAIN_WINDOW_LOAD_FILE
}

export const MAIN_WINDOW_PARAM = {
    width: MAIN_WINDOW_WIDTH,
    height: MAIN_WINDOW_HEIGHT,
    show: MAIN_WINDOW_SHOW,
    preload_dir: MAIN_WINDOW_PRELOAD_DIR,
    devTools: MAIN_WINDOW_DEVTOOLS,
    loadFile: main_load_file,
    ico: MAIN_WINDOW_ICON
}

//notes 窗口参数
export const NOTES_PRELOAD_DIR = preloadPath
const NOTES_LOAD_FILE_DEV = 'http://localhost:4000#notes'
const NOTES_LOAD_FILE_PRO = `file://${join(rootPath, 'dist/index.html')}#/notes`
let note_load_file;
if (process.env.NODE_ENV === 'development') {
    note_load_file = NOTES_LOAD_FILE_DEV
}
else {
    note_load_file = NOTES_LOAD_FILE_PRO
}
export const NOTES_LOAD_FILE = note_load_file