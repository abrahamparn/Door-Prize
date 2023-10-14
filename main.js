const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')
const reader = require('xlsx') 

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
    aboutWindow.setMenu(null);

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

// Response to IPC Renderer
ipcMain.on('downloadFolder', () => {
    const sourceFilePath = path.join(__dirname, 'Template_Database.xlsx'); // Replace 'Template_Database.xlsx' with your file name
    const downloadFolder = app.getPath('downloads');
    const templateFolder = path.join(downloadFolder, 'template');

    const destinationFilePath = path.join(templateFolder, 'Template_Database.xlsx'); // Replace 'Template_Database.xlsx' with your desired file name

    // Create the 'template' folder if it doesn't exist
    if (!fs.existsSync(templateFolder)) {
        fs.mkdirSync(templateFolder);
    }

    fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
        if (err) {
            console.error('Error copying the file:', err);
        } else {
            console.log('File copied successfully.');

            // Open the 'template' folder
            shell.openPath(templateFolder);getDataParticipants()
        }
    });
});

// THIS FUNCTION IS TO EXTRACT THE DATA FROM THE EXCEL
function getDataParticipants(){
    // Reading our test file 
    const file = reader.readFile('./Template_Database.xlsx') // Change this to make it dynamic a
    let data = [] 
    
    const sheets = file.SheetNames 
    
    for(let i = 0; i < sheets.length; i++) { 
        const temp = reader.utils.sheet_to_json( 
                file.Sheets[file.SheetNames[i]]) 
                temp.forEach((res) => { 
                    if(res.ISSELECTED !== 1){
                        data.push(res.Name) 
                    }
                }
        ) 
    } 
    console.log(data)
}

// THIS IS TO RECEIVE THE EXCEL
// Response to IPC Renderer
ipcMain.on('excel:doNothing', (e, options) => {
    console.log(options);

    // 1. Remove Any Files from the DataBaseFolder
    const dataBaseFolder = path.join(__dirname, 'DataBaseFolder'); // Assuming 'DataBaseFolder' is in the same directory as your script

    fs.readdir(dataBaseFolder, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }

        // Iterate through files in the directory and remove them
        files.forEach((file) => {
            const filePath = path.join(dataBaseFolder, file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                } else {
                    console.log("File deleted:", filePath);
                }
            });
        });
    });

    // 2. Add the Excel File from options.databaseExcel2
    if (options.databaseExcel2) {
        const excelFileName = path.basename(options.databaseExcel2); // Get the file name from the path
        const destinationPath = path.join(dataBaseFolder, excelFileName);

        fs.copyFile(options.databaseExcel2, destinationPath, (err) => {
            if (err) {
                console.error("Error copying Excel file:", err);
            } else {
                console.log("Excel file copied to DataBaseFolder:", destinationPath);
            }
        });
    }
});