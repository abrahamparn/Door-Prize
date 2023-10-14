const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')

const isMac = process.platform === 'darwin'
process.env.NODE_ENV = 'development'
const isDev = process.env.NODE_ENV !== 'production'

let mainWindow;
function createMainWindow(){
     mainWindow = new BrowserWindow({
        title:"Title...", // Change it if you want
        width: isDev? 1000: 500, // Change it if you want
        height: isDev? 1000: 600, // Change it if you want
        webPreferences: {
            contextIsolation:true,
            nodeIntegration:true,
            preload: path.join(__dirname, 'preload.js')
          }
      
    });

    // Open dev tools if in dev environment
    if(isDev){
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'))
}
// Create about window
function createAboutWindow(){
    const aboutWindow = new BrowserWindow({
        title:"Title...", // Change it if you want
        width: 300, // Change it if you want
        height: 300, // Change it if you want
    });

 

    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'))
}


app.whenReady().then(()=>{
    createMainWindow();
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu)
    mainMenu.on('closed', ()=>{
        mainWindow = null
    })
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
      })
})

// MENU TEMPLATE  // Change it if you want
const menu = [
    ...(isMac ? [{
        label: app.name,
        subMenu:[{
            label: 'About',
            click: createAboutWindow
        }]
    }] : []),
    {
    label:'File',
    submenu:  [{
        label: 'Quit',
        click: () =>{app.quit()},
        accelerator: 'CTRL+W'
    }]
}, 
    ...(!isMac ? [{
        label: 'Help',
        submenu: [
            {
                label:'About',
                click: createAboutWindow
            }
        ]
    }]: [])

]



app.on('window-all-closed', () => {
    if (!isMac) {
    app.quit()
    }
})