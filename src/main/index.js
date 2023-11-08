import { app, BrowserWindow, ipcMain } from 'electron';
const { autoUpdater } = require('electron-updater');

import ConfigHelper from '../renderer/helpers/ConfigHelper.js';
import Connection from '../renderer/helpers/Connection.js';
import BaseUrl from '../renderer/helpers/baseUrl.js';
const fs = require('fs');
//const fetch = require('electron-fetch');
import fetch from 'electron-fetch';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
let appInitialized = false;
/**/
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
async function createMainWindow() {/**/

  console.log('Create Main Window Function')

  /**Initial window options */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: { nodeIntegration: true, contextIsolation: false, enableRemoteModule: true }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Set The Menu to the Main Window
  mainWindow.setMenuBarVisibility(false)
}

function initApp() {

  /*fetch('https://randomuser.me/api/')
  .then(async (res) => {
      console.log('aaa')
      var response = await res.clone().json();
      console.log(response)
  });*/
  console.log('App Init');
  appInitialized = true;
  ConfigHelper.InitializeAplication(fetch);
  createMainWindow();
}

app.on('ready', initApp);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }/**/
});

app.on('activate', () => {
  if (!appInitialized) {
    initApp();
  }else if (mainWindow === null) {
    createMainWindow();
  }
});
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
