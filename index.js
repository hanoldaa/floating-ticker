const { app, BrowserWindow } = require('electron');

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 600,
    height: 40,
    webPreferences: {
      nodeIntegration: true
    },
    alwaysOnTop: true,
    frame: false,
    maxHeight: 40,
    minHeight: 40,
    minWidth: 100,
    maxWidth: 6000
  })

  // and load the index.html of the app.
  win.loadFile('index.html')

  win.show();
}

app.on('ready', createWindow)
