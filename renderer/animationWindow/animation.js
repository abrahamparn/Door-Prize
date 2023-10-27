
const element = document.getElementById('testing')
const button = document.getElementById('CLickMe')
const divHtml = document.querySelector('.percobaanTesting')

// Attach the logic to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    let theHtml = ``
    let arrayDataParsed =[];
    ipcRenderer.send('toShowData');

    ipcRenderer.on('sendRolledData', function(receivedData) {
        let data = receivedData.theData; // Get the data from the event
       // element.innerHTML = JSON.stringify(data);
    //    console.log(data)
       let updatedStrArray = data.map(str => str.replace(/\n/g, '<br>'));
       console.log(updatedStrArray)
       updatedStrArray.forEach(element => {
        // console.log(element)
        theHtml +=`<p class='text-white text-left'>${element}</p>`
        
       });
       divHtml.innerHTML = theHtml

    });

});