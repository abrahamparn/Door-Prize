// Change this later on
// const electron = document.querySelector(".electron")
// const node = document.querySelector(".node")
// const chrome = document.querySelector(".chrome")

// electron.innerHTML = "electron's version: "+versions.electron();
// node.innerHTML = "node's version: "+versions.node();
// chrome.innerHTML = "chrome's version: "+versions.chrome();

// Validation Input

let rollNumber = 1;

let submitButton = document.getElementById("submit");
let number = document.getElementById("number");
let validationNonFeedback = document.querySelectorAll(".validation");
let validationFeedback = document.querySelectorAll(".validation-feedback");
let doorPriceName = document.querySelector("#name"); // This is for the name of the door prize
let theDoorPriceName;

// submitButton.addEventListener("click", function(e) {
//     e.preventDefault();
//     let valid = true;

//     validationFeedback.forEach((feedback) => {
//         feedback.innerHTML = ""; // Clear previous feedback messages
//     });

//     validationNonFeedback.forEach((elmForm) => {
//         elmForm.classList.remove("is-invalid");

//         if (elmForm.value.trim() === "") {
//             elmForm.classList.add("is-invalid");
//             const feedback = elmForm.closest(".form-group").querySelector(".validation-feedback");
//             feedback.innerHTML = "This Field is Required";
//             valid = false;
//         }else if (elmForm.id === "number") {
//             // Only validate the 'number' field here
//             if (!Number.isFinite(parseFloat(elmForm.value))) {
//                 elmForm.classList.add("is-invalid");
//                 const feedback = elmForm.closest(".form-group").querySelector(".validation-feedback");
//                 feedback.innerHTML = "Must be a number";
//                 valid = false;
//             }
//         }
//     });

//     if (valid) {
//         rollNumber = number.value
//         theDoorPriceName = doorPriceName.value
//         console.log("Form is valid. Submitting...");
//         ipcRenderer.send('Rollingmiscellaneous', {

//             rollNumber,
//             theDoorPriceName
//         })
//         getFileAndChangeBackground(theDoorPriceName)

//         // Add code to submit the form or perform other actions here.
//     } else {
//         alert("Form is not valid.");
//     }
// });

// let fileBackgroundInput = document.getElementById('fileBackground');
// let mainContainer = document.querySelector('.theBody');

// fileBackgroundInput.addEventListener('change', function () {
//     const file = this.files[0];

//     // Check if a file was selected
//     if (file) {
//         // Check if the selected file is an image (you can use more precise image types)
//         if (file.type.startsWith('image/')) {
//             // Create a URL for the selected image
//             const imageURL = URL.createObjectURL(file);

//             // Set the background image of the main container
//             mainContainer.style.backgroundImage = `url(${imageURL})`;
//             mainContainer.style.backgroundSize = 'cover';
//             mainContainer.style.backgroundRepeat = 'no-repeat';
//             mainContainer.style.backgroundAttachment = 'fixed'; // Optional, for fixed background
//             mainContainer.style.backgroundPosition = 'center center';
//         } else {
//             // Handle the case where the selected file is not an image
//             alert('Please select a valid image file.');
//             // Clear the file input if an invalid file is selected
//             fileBackgroundInput.value = '';
//         }
//     }
// });

// THIS IS THE DATABASE CHECKER
// STARTS HERE
// STARTS HERE
// let clearBackgroundButton = document.getElementById('clearBackground');

// clearBackgroundButton.addEventListener('click', function () {
//     mainContainer.style.backgroundImage = 'none';
//     fileBackgroundInput.value = ''; // Clear the file input
// });
// function getFileAndChangeBackground(backGroundName) {
//   let makanan = backGroundName;
//   if (hasWhiteSpace(backGroundName) === true) {
//     makanan = backGroundName.split(" ");
//     makanan = makanan.join("%20");
//   }
//   var link = `../renderer/image/kids.png`;
//   let mainContainer = document.querySelector(".theBody");
//   // Set the background image of the main container
//   mainContainer.style.backgroundImage = `url(${link})`;
//   console.log(link);
//   let backgroundImageOverlay = document.createElement("div");

//   mainContainer.style.backgroundSize = "cover";
//   mainContainer.style.backgroundRepeat = "no-repeat";
//   mainContainer.style.backgroundAttachment = "fixed"; // Optional, for fixed background
//   mainContainer.style.backgroundPosition = "center center";
//   backgroundImageOverlay.classList.add("background-overlay");
//   mainContainer.appendChild(backgroundImageOverlay);
//   backgroundImageOverlay.style.opacity = 0.5;
// }

function hasWhiteSpace(s) {
  return s.indexOf(" ") >= 0;
}

// ENDS HERE
// ENDS HERE
const duration = 2000;
let namesHtml;
let letters;
let steps;

const map = (n, x1, y1, x2, y2) =>
  Math.min(Math.max(((n - x1) * (y2 - x2)) / (y1 - x1) + x2, x2), y2);

const random = (set) => set[Math.floor(Math.random() * set.length)];

let frame;
let startTime = 0; // Initialize the startTime variable
let Rolling = document.getElementById("buttonRolling");
Rolling.addEventListener("click", () => {
  document.getElementById('yangBakalanDiHidden').classList.add('d-none')
  // document.getElementById('yangBakalanDiHidden').classList.remove
  ipcRenderer.send("RollingDoorPrice");
});
let datadata = document.querySelector(".datadata");
//let judulDoorPrise = document.querySelector(".judulData");
ipcRenderer.on("sendRollingData", function (data) {
  console.log(data);
  document.getElementById("CardDisplay").classList.remove("d-none");
  if (data.Error != null) {
    datadata.innerHTML = data.Message;
  } else {
    judulHTML = `${data.theDoorPriceName}`.toUpperCase().bold();
    ;
    namesHtml = ``; // Initialize an empty string to accumulate the names

    data.ChoosenOne.forEach((item) => {
      console.log(item);
      namesHtml += `<div ><h2 class="bg-light">${item.NAME} - ${item.KPK}</h2></div>`; // Add each name to the string
    });
    //judulDoorPrise.innerHTML = judulHTML;
    // Initialize letters and steps here
    letters = String(namesHtml).split("");
    steps = letters.length;

    cancelAnimationFrame(frame); // Stop the previous animation (if any)
    startTime = Date.now(); // Reset the startTime
    animate();
  }
});
let animationId;

function animate2() {
  datadata.classList.remove('d-none')
  frame = requestAnimationFrame(animate2);

  const currentTime = Date.now();
  const step = Math.round(map(currentTime - startTime, 0, duration, 0, steps));

  datadata.innerHTML = letters
    .map((s, i) => (step - 1 >= i ? letters[i] : random("081383838")))
    .join("");

  if (step >= steps) {
    cancelAnimationFrame(frame);
  }
}

function animate() {
  datadata.classList.add('d-none')

  document.getElementById("randomErrorinAja").classList.remove('d-none')
  document.getElementById("randomErrorinAja").innerText = randomString(10);
  animationId = requestAnimationFrame(animate);
}

function randomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}



document.getElementById('stopAnimation').addEventListener('click', function(){
  document.getElementById("randomErrorinAja").classList.add('d-none')
  datadata.classList.remove('d-none')
  cancelAnimationFrame(animationId);

  animate2()
})
// THIS IS FOR ABOUT
ipcRenderer.on("sendDrawData", function (data) {
  theDoorPriceName = data.name;
  rollNumber = data.quantity;
  ipcRenderer.send('Rollingmiscellaneous', {
            
    rollNumber,
    theDoorPriceName
})
  // getFileAndChangeBackground("SEPEDAH");
  //datadata.innerHTML = data.name
  //judulDoorPrise.innerHTML = data.name
  document.getElementById('DoorPrizeApplication').innerHTML = data.name
  document.getElementById('DoorPrizeApplication').style.fontSize = '60px'
});

window.addEventListener('keyup', (event) => {
  if (event.ctrlKey && event.key === 'Enter') {
    Rolling.click()
  }

  if(event.ctrlKey && event.key === 'Shift'){
    document.getElementById('stopAnimation').click()
  }
}, true);