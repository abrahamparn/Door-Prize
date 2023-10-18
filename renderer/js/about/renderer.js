
let downloadTemplate = document.querySelector("#downloadTemplate")
downloadTemplate.addEventListener('click', function(){
        // send to main using ipcRenderer
        console.log("makanan")
    ipcRenderer.send('downloadFolder')
})

let submitButton = document.getElementById('submit')
let databaseExcel = document.getElementById('databaseExcel')
databaseExcel.addEventListener('change', loadFile)
function loadFile(e){
    const file = e.target.files[0]
    if(!isFileExcel(file)){
        alert('Please select an excel file!')
        databaseExcel.value = ''
     return
    }
}
// Check if file is an Excel file
function isFileExcel(file) {
    const acceptedExcelFileTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    return file && acceptedExcelFileTypes.includes(file.type);
}
submitButton.addEventListener('click', ()=>{
    if(databaseExcel.value != ''){
        console.log(databaseExcel.value)
        // Sending the excel file to the place and removing anything else from that folder
        const databaseExcel2 = databaseExcel.files[0].path;
        if(!databaseExcel2){
            alert('Please upload an image')
            return
        }

        // send to main using ipcRenderer
        // send Doorprise Name and the Number of People
        ipcRenderer.send('excel:doNothing', {
            databaseExcel2,
        
        })
    }
    else{
        alert("File Excel Cannot be found")
    }
})

ipcRenderer.on('errroReadingExcelFile', (e, Option)=>{
    if(Option.name != null){
        alert(Option.name)
    }
})