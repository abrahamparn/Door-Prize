
const element = document.getElementById('testing')
const button = document.getElementById('CLickMe')
const divHtml = document.querySelector('.percobaanTesting')

// Attach the logic to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    let theHtml = ``

    ipcRenderer.send('toShowData');

    ipcRenderer.on('sendRolledData', function(receivedData) {
        let data = receivedData.theData; // Get the data from the event
       // element.innerHTML = JSON.stringify(data);
       data.forEach(element => {
        console.log(element)
        theHtml +=`<p class='text-white text-center'>${element.NAME} ${element.KPK}</p>`
        
       });
       divHtml.innerHTML = theHtml

    });

});