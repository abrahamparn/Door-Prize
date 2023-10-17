const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')
const reader = require('xlsx') 
let rollNumber = 1;
let theDoorPriceName;
const ExcelJS = require('exceljs');
const databaseFilePath = path.join(process.resourcesPath, 'Template_Database.xlsx');


const isMac = process.platform === 'darwin'
process.env.NODE_ENV = 'development'
const isDev = process.env.NODE_ENV !== 'production'

let mainWindow;
function createMainWindow(){
     mainWindow = new BrowserWindow({
        title:"Title...", // Change it if you want
        width: isDev? 1000: 1000, // Change it if you want
        height: isDev? 1000: 1000, // Change it if you want
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
            shell.openPath(templateFolder);
        }
    });
});
// THIS IS TO RECEIVE THE EXCEL
// Response to IPC Renderer
ipcMain.on('excel:doNothing', (e, options) => {

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
        const destinationPath = path.join(__dirname, './renderer/Template_Database.xlsx')

        fs.copyFile(options.databaseExcel2, destinationPath, (err) => {
            if (err) {
                console.error("Error copying Excel file:", err);
            } else {
                console.log("Excel file copied to DataBaseFolder:", destinationPath);
            }
        });
    }
});
//STARTING HERE, EVERYTHING IS ABOUT THE ROLLING FUNCTION ROLLING 
//FUNCTION ROLLING FUNCTION
//FUNCTION ROLLING FUNCTION
//FUNCTION ROLLING FUNCTION
//FUNCTION ROLLING FUNCTION
// THIS FUNCTION IS TO EXTRACT THE DATA FROM THE EXCEL
let TotalNumber = [];
function getDataParticipants(){
    // Reading our test file 
    const file = reader.readFile(path.join(__dirname, './renderer/Template_Database.xlsx')) // Change this to make it dynamic a
    let data = [] 

    
    const sheets = file.SheetNames 
    
    for(let i = 0; i < sheets.length; i++) { 
        const temp = reader.utils.sheet_to_json( 
                file.Sheets[file.SheetNames[i]]) 
                temp.forEach((res) => { 
                    TotalNumber.push(res.name)
                    if(res.ISSELECTED != 1){
                        data.push({NAME: res.Name, KPK:res.KPK}) 
                    }
                }
        ) 
    } 
    return data
}

ipcMain.on('Rollingmiscellaneous', (e, options)=>{
    console.log(options )
    rollNumber = +options.rollNumber
    theDoorPriceName = options.theDoorPriceName
})

// This is for the door price
ipcMain.on('RollingDoorPrice', function(event){
    let makanan = getDataParticipants()
    console.log(makanan)
    
    if(rollNumber < 0 || rollNumber == null){
        mainWindow.webContents.send('sendRollingData', 

        {Error: 500, Message: "Rolling Number Cannot Be Null"});

    }else if(theDoorPriceName === null || theDoorPriceName === "" || theDoorPriceName === undefined){
        mainWindow.webContents.send('sendRollingData', {Error: 500, Message: "DoorPrice Name Cannot Be null"});

    }
    else{
        let  ChoosenOne = RollingData(makanan)
        mainWindow.webContents.send('sendRollingData', {ChoosenOne, theDoorPriceName});

    }
})

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  
function RollingData(makanan){
   let shuffledArray = shuffle(makanan)
   console.log(shuffledArray.length)
   let ChoosenOne = []
   for(let i = 0; i < rollNumber; i++){

    ChoosenOne.push(shuffledArray[i])
   }
   console.log(shuffledArray)
//    WriteEXCEL(ChoosenOne)
   return ChoosenOne
}

function WriteEXCEL(ChoosenOne){
    const inputFile = path.join(__dirname, './renderer/Template_Database.xlsx')
    const sheetName = 'Sheet1';
    const workbook = reader.readFile(inputFile);
    // Get the worksheet
    const worksheet = workbook.Sheets[sheetName];
    // Define the columns
    const nameColumn = 'A';
    const kpkColumn = 'B';
    const isSelectedColumn = 'D';
    const DoorPriceColumn = 'E'
    
    const isSelectedValue = 1;
    ChoosenOne.forEach((item) => {
        for (let i = 2; i <= TotalNumber.length; i++) { // Assuming data starts from row 2 and ends at row 10
            const cellName = worksheet[`${nameColumn}${i}`];
            const cellKPK = worksheet[`${kpkColumn}${i}`];
        
            if (cellName && cellKPK) {
              if (cellName.v === item.NAME && cellKPK.v === item.KPK) {
                worksheet[`${isSelectedColumn}${i}`] = { t: 'n', v: isSelectedValue };
                worksheet[`${DoorPriceColumn}${i}`] = { t: 'n', v: theDoorPriceName };
                break; // Assuming there is only one matching row
              }
            }
          }
           // Write the updated worksheet back to the workbook
    workbook.Sheets[sheetName] = worksheet;
    reader.writeFile(workbook, inputFile);

    })
    

     
}