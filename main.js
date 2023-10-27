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
process.env.NODE_ENV = 'production'
const isDev = process.env.NODE_ENV !== 'production'

let mainWindow;
let aboutWindow;
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
    aboutWindow = new BrowserWindow({
        title:"Title...", // Change it if you want
        width: 600, // Change it if you want
        height: 400, // Change it if you want
        webPreferences: {
            contextIsolation:true,
            nodeIntegration:true,
            preload: path.join(__dirname, 'preload.js')
          }
    });
    aboutWindow.setMenu(null);
    
    if(isDev){
        aboutWindow.webContents.openDevTools();
    }

    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'))
}

function createAnimateWindow(){
  animateWindow = new BrowserWindow({
    title: "Animate...",
    width: 600,
    height: 400,
    webPreferences:{
      contextIsolation:true,
      nodeIntegration:true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  animateWindow.setMenu(null);
  if(isDev){
    animateWindow.webContents.openDevTools();
  }

  animateWindow.loadFile(path.join(__dirname, 'renderer', 'animationWindow', 'animation.html'))
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
    ...(isMac
    ? [
        {
          label: app.name,
          subMenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
   
  ...(!isMac
    ? [
        {
          label: "Draw",
          submenu: [
            {
              label: "Portable Doll House (FXG55)",
              click: () => consoleLog("Portable Doll House (FXG55)", 10),
            },
            {
              label: "Barbie Wedding Dolls (DJR88)",
              click: () => consoleLog("Barbie Wedding Dolls (DJR88)", 15),
            },
            {
              label: "Barbie Fashionista Ultimate (GBK12)",
              click: () =>
                consoleLog("Barbie Fashionista Ultimate (GBK12)", 40),
            },
            {
              label: "Barbie You Can Be Anything (GNC63)",
              click: () => consoleLog("Barbie You Can Be Anything (GNC63)", 20),
            },
            {
              label: "Barbie Dolls and Vehicle (GVK02)",
              click: () => consoleLog("Barbie Dolls and Vehicle (GVK02)", 5),
            },
            {
              label: "Full Articulated Fashion Doll (GNC48)",
              click: () =>
                consoleLog("Full Articulated Fashion Doll (GNC48)", 50),
            },
            {
              label: "Hot Wheels Advent Calendar (GTD78)",
              click: () => consoleLog("Hot Wheels Advent Calendar (GTD78)", 10),
            },
            {
              label: "How Wheels Five Cars (1806)",
              click: () => consoleLog("How Wheels Five Cars (1806)", 50),
            },
            {
              label: "Juicer",
              click: () => consoleLog("Juicer", 6),
            },
            {
              label: "Set Alat Makan",
              click: () => consoleLog("Set Alat Makan", 7),
            },
            {
              label: "Tas Travel",
              click: () => consoleLog("Tas Travel", 4),
            },
            {
              label: "Setrika",
              click: () => consoleLog("Setrika", 2),
            },
            {
              label: "Kipas",
              click: () => consoleLog("Kipas", 2),
            },
            {
              label: "Panci",
              click: () => consoleLog("Panci", 1),
            },
            {
              label: "Kulkas",
              click: () => consoleLog("Kulkas", 1),
            },
          ],
        },
      ]
    : []),

  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        click: () => {
          app.quit();
        },
        accelerator: "Ctrl+W",
      },
    ],
  },
  {
    label: "Result",
    submenu: [
      {
        label: "Check Result",
        click: () => {
          resultResult()
        },
       
      },
    ],
  },
  {
    label: "Animate",
    submenu: [
      {
        label: "Check Result",
        click: createAnimateWindow,
       
      },
    ],
  },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [
            {
              label: "Upload Dataset",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
];
  

function consoleLog(name, qty){
    console.log(name, qty)
    mainWindow.webContents.send('sendDrawData', {name: name, quantity: qty});
}

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

function resultResult(){
  const Path = path.join(__dirname, 'renderer')
  shell.openPath(Path)
}
// THIS IS TO RECEIVE THE EXCEL
// Response to IPC Renderer
ipcMain.on('excel:doNothing', (e, options) => {

    // 1. Remove Any Files from the DataBaseFolder
    const rendererFolder = path.join(__dirname, 'renderer'); // Assuming 'DataBaseFolder' is in the same directory as your script

    fs.readdir(rendererFolder, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            aboutWindow.webContents.send("errroReadingExcelFile", {name:"Error Reading Excel FIle"})
            return;
        }

        
    });

    // 2. Add the Excel File from options.databaseExcel2
    if (options.databaseExcel2) {

        const destinationPath = path.join(__dirname, `./renderer/Template_Database.xlsx`)

        fs.copyFile(options.databaseExcel2, destinationPath, (err) => {
            if (err) {
                console.error("Error copying Excel file:", err);
            } else {
                aboutWindow.webContents.send("errroReadingExcelFile", {name:"Error Reading Excel FIle"})
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

    let data1=[]
    let data2=[]
    let data3=[]
    let data4=[]
    let data5=[]
    let data6=[]
    let data7=[]
    let data8=[]
    let data9=[]

    
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
ipcMain.on('toShowData', function(){
   // Reading our test file 
   const file = reader.readFile(path.join(__dirname, './renderer/Template_Database.xlsx')) // Change this to make it dynamic a
   let data = []
   const sheets = file.SheetNames 
   
   for(let i = 0; i < sheets.length; i++) { 
       const temp = reader.utils.sheet_to_json( 
               file.Sheets[file.SheetNames[i]]) 
               temp.forEach((res) => { 
                   if(res.ISSELECTED === 1){
                       data.push({NAME: res.Name, KPK:res.KPK}) 
                   }
               }
       ) 
   } 
   console.log(data)

   animateWindow.webContents.send('sendRolledData', {theData: data})
   
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
   WriteEXCEL(ChoosenOne)
   return ChoosenOne
}
// function WriteEXCEL(ChoosenOne){

//     ChoosenOne.forEach((item) =>{
//         setTimeout(() => {
            

//             const data = `${item.NAME} ${item.KPK} ${theDoorPriceName}`;
//             fs.writeFile(path.join(__dirname, './file.txt'), data, {flag: 'a+'}, (err) => { 
//                 if (err) { 
//                     throw err; 
//                 } 
//                 console.log("File is updated."); 
//             });
     
//             const inputFile = path.join(__dirname, './renderer/Template_Database.xlsx');
//             const sheetName = 'Sheet1';
//             const workbook = reader.readFile(inputFile);
//             // Get the worksheet
//             const worksheet = workbook.Sheets[sheetName];
//             // Define the columns
//             const nameColumn = 'A';
//             const kpkColumn = 'B';
//             const isSelectedColumn = 'D';
        
//             const isSelectedValue = 1;
//             for (let i = 2; i <= TotalNumber.length; i++) {
//               const cellName = worksheet[`${nameColumn}${i}`];
//               const cellKPK = worksheet[`${kpkColumn}${i}`];
        
//               if (cellName && cellKPK) {
//                 if (cellName.v === item.NAME && cellKPK.v === item.KPK) {
//                   worksheet[`${isSelectedColumn}${i}`] = { t: 'n', v: isSelectedValue };
//                   break; // Assuming there is only one matching row
//                 }
//               }
//             }
        
//             // Write the updated worksheet back to the workbook
//             workbook.Sheets[sheetName] = worksheet;
//             reader.writeFile(workbook, inputFile);
//           }, 100); // Delay each iteration by 0.1 seconds (100 milliseconds)  
//     })
// }

async function WriteEXCEL(ChoosenOne) {
  const percobaan = `${theDoorPriceName}`;
  console.log(percobaan)
  await fs.appendFile(path.join(__dirname, './renderer/file.txt'), percobaan+'\n', {flag: 'a+'}, (err) => { 
      if (err) { 
          throw err; 
      } 
      console.log("File is updated."); 
  });
  console.log(ChoosenOne)
    for (const item of ChoosenOne) {
      try {
        const data = `${item.NAME} ${item.KPK}`;
        console.log(data)
        await fs.appendFile(path.join(__dirname, './renderer/file.txt'), data+'\n', {flag: 'a+'}, (err) => { 
            if (err) { 
                throw err; 
            } 
            console.log("File is updated."); 
        });
        
        const inputFile = path.join(__dirname, './renderer/Template_Database.xlsx');
        const sheetName = 'Sheet1';
        const workbook = reader.readFile(inputFile);
         // Get the worksheet
              const worksheet = workbook.Sheets[sheetName];
              // Define the columns
              const nameColumn = 'A';
              const kpkColumn = 'B';
              const isSelectedColumn = 'D';
          
              const isSelectedValue = 1;
              for (let i = 2; i <= TotalNumber.length; i++) {
                const cellName = worksheet[`${nameColumn}${i}`];
                const cellKPK = worksheet[`${kpkColumn}${i}`];
          
                if (cellName && cellKPK) {
                  if (cellName.v === item.NAME && cellKPK.v === item.KPK) {
                    worksheet[`${isSelectedColumn}${i}`] = { t: 'n', v: isSelectedValue };
                    break; // Assuming there is only one matching row
                  }
                }
              }
          
              // Write the updated worksheet back to the workbook
              workbook.Sheets[sheetName] = worksheet;
              reader.writeFile(workbook, inputFile);
      } catch (err) {
        console.error("Error writing to file.txt:", err);
      }
      await new Promise(resolve => setTimeout(resolve, 100)); // Delay each iteration by 100 milliseconds
    }
  
  await fs.appendFile(path.join(__dirname, './renderer/file.txt'), '\n', {flag: 'a+'}, (err) => { 
    if (err) { 
        throw err; 
    } 
    console.log("File is updated."); 
  });
}


// THIS WORKS WORKS WORKS
// function WriteEXCEL(ChoosenOne){
//         let doorPriceNameInThis = theDoorPriceName

//     ChoosenOne.forEach((item) =>{
//         setTimeout(() => {
//             const inputFile = path.join(__dirname, './renderer/Template_Database.xlsx');
//             const sheetName = 'Sheet1';
//             const workbook = reader.readFile(inputFile);
//             // Get the worksheet
//             const worksheet = workbook.Sheets[sheetName];
//             // Define the columns
//             const nameColumn = 'A';
//             const kpkColumn = 'B';
//             const isSelectedColumn = 'D';
//             const DoorPriceColumn = 'E';
        
//             const isSelectedValue = 1;
//             for (let i = 2; i <= TotalNumber.length; i++) {
//               const cellName = worksheet[`${nameColumn}${i}`];
//               const cellKPK = worksheet[`${kpkColumn}${i}`];
        
//               if (cellName && cellKPK) {
//                 if (cellName.v === item.NAME && cellKPK.v === item.KPK) {
//                   worksheet[`${isSelectedColumn}${i}`] = { t: 'n', v: isSelectedValue };
//                   worksheet[`${DoorPriceColumn}${i}`] = { t: 'n', v: doorPriceNameInThis };
//                   break; // Assuming there is only one matching row
//                 }
//               }
//             }
        
//             // Write the updated worksheet back to the workbook
//             workbook.Sheets[sheetName] = worksheet;
//             reader.writeFile(workbook, inputFile);
//           }, 100); // Delay each iteration by 0.1 seconds (100 milliseconds)  
//     })
// }


// async function WriteEXCEL(dataArray){
//     console.log(dataArray)
//     let doorPriceNameInThis = theDoorPriceName
//     for (let item of dataArray) {
//         try {
//             await new Promise((resolve) => {
//                 setTimeout(async () => {
//                     const inputFile = path.join(__dirname, './renderer/Template_Database.xlsx');
//                     const sheetName = 'Sheet1';
//                     const workbook = reader.readFile(inputFile);
//                     const worksheet = workbook.Sheets[sheetName];
                    
//                     const nameColumn = 'A';
//                     const kpkColumn = 'B';
//                     const isSelectedColumn = 'D';
//                     const doorPriceColumn = 'E';
//                     const isSelectedValue = 1;

//                     // Check if TotalNumber exists and is an array
//                     if (!Array.isArray(TotalNumber)) {
//                         throw new Error('TotalNumber is not defined or not an array');
//                     }

//                     for (let i = 2; i <= TotalNumber.length; i++) {
//                         const cellName = worksheet[`${nameColumn}${i}`];
//                         const cellKPK = worksheet[`${kpkColumn}${i}`];
                
//                         if (cellName && cellKPK) {
//                             if (cellName.v === item.NAME && cellKPK.v === item.KPK) {
//                                 worksheet[`${isSelectedColumn}${i}`] = { t: 'n', v: isSelectedValue };
//                                 worksheet[`${doorPriceColumn}${i}`] = { t: 'n', v: doorPriceNameInThis };
//                                 break; // Assuming there is only one matching row
//                             }
//                         }
//                     }
                
//                     workbook.Sheets[sheetName] = worksheet;
//                     reader.writeFile(workbook, inputFile);
//                     resolve();
//                 }, 100); // Delay each iteration by 0.1 seconds (100 milliseconds)
//             });
//         } catch (error) {
//             console.error(`Error occurred while processing item ${item.NAME}: ${error.message}`);
//         }
//     }
// }