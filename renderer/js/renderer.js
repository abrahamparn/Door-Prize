// Change this later on
// const electron = document.querySelector(".electron")
// const node = document.querySelector(".node")
// const chrome = document.querySelector(".chrome")


// electron.innerHTML = "electron's version: "+versions.electron();
// node.innerHTML = "node's version: "+versions.node();
// chrome.innerHTML = "chrome's version: "+versions.chrome();

// Validation Input
let downloadTemplate = document.querySelector("#downloadTemplate")
downloadTemplate.addEventListener('click', function(){
      // send to main using ipcRenderer
      console.log("makanan")
    ipcRenderer.send('downloadFolder')
})
let rollNumber = 1;

let submitButton = document.getElementById('submit')
let number = document.getElementById('number')
let validationNonFeedback = document.querySelectorAll('.validation');
let validationFeedback = document.querySelectorAll('.validation-feedback');
let databaseExcel = document.querySelector('#databaseExcel')
let doorPriceName = document.querySelector('#name') // This is for the name of the door prize


submitButton.addEventListener("click", function(e) {
    e.preventDefault();
    let valid = true;
    
    validationFeedback.forEach((feedback) => {
        feedback.innerHTML = ""; // Clear previous feedback messages
    });

    validationNonFeedback.forEach((elmForm) => {
        elmForm.classList.remove("is-invalid");

        if (elmForm.value.trim() === "") {
            elmForm.classList.add("is-invalid");
            const feedback = elmForm.closest(".form-group").querySelector(".validation-feedback");
            feedback.innerHTML = "This Field is Required";
            valid = false;
        }else if (elmForm.id === "number") {
            // Only validate the 'number' field here
            if (!Number.isFinite(parseFloat(elmForm.value))) {
                elmForm.classList.add("is-invalid");
                const feedback = elmForm.closest(".form-group").querySelector(".validation-feedback");
                feedback.innerHTML = "Must be a number";
                valid = false;
            }
        }
    });

    if (valid) {
        rollNumber = number.value
        theDoorPriceName = doorPriceName.value
        console.log("Form is valid. Submitting...");
        ipcRenderer.send('Rollingmiscellaneous', {
            
            rollNumber,
            theDoorPriceName
        })

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

        // Add code to submit the form or perform other actions here.
    } else {
        console.log("Form is not valid.");
    }
});

let fileBackgroundInput = document.getElementById('fileBackground');
let mainContainer = document.querySelector('.theBody');

fileBackgroundInput.addEventListener('change', function () {
    const file = this.files[0];

    // Check if a file was selected
    if (file) {
        // Check if the selected file is an image (you can use more precise image types)
        if (file.type.startsWith('image/')) {
            // Create a URL for the selected image
            const imageURL = URL.createObjectURL(file);

            // Set the background image of the main container
            mainContainer.style.backgroundImage = `url(${imageURL})`;
            mainContainer.style.backgroundSize = 'cover';
            mainContainer.style.backgroundRepeat = 'no-repeat';
            mainContainer.style.backgroundAttachment = 'fixed'; // Optional, for fixed background
            mainContainer.style.backgroundPosition = 'center center';
        } else {
            // Handle the case where the selected file is not an image
            alert('Please select a valid image file.');
            // Clear the file input if an invalid file is selected
            fileBackgroundInput.value = '';
        }
    }
});

// THIS IS THE DATABASE CHECKER
// STARTS HERE
// STARTS HERE
let clearBackgroundButton = document.getElementById('clearBackground');

clearBackgroundButton.addEventListener('click', function () {
    mainContainer.style.backgroundImage = 'none';
    fileBackgroundInput.value = ''; // Clear the file input
});

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

// ENDS HERE
// ENDS HERE

let Rolling = document.getElementById('buttonRolling')
Rolling.addEventListener('click', ()=>{ 
    ipcRenderer.send('RollingDoorPrice')
})
let datadata = document.querySelector('.datadata')
ipcRenderer.on('sendRollingData', function(data){
    console.log(data)
    document.getElementById('CardDisplay').classList.remove('d-none')
    if(data.Error != null){
        datadata.innerHTML = data.Message

    }else{
        let namesHtml = `Door Price:${data.theDoorPriceName}<br>`; // Initialize an empty string to accumulate the names
        
        data.ChoosenOne.forEach((item) => {
            console.log(item);
            namesHtml += `${item.NAME} (KPK: ${item.KPK})<br>`; // Add each name to the string
        });

        datadata.innerHTML = namesHtml; 
    }
})