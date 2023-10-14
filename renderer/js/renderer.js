// Change this later on
const electron = document.querySelector(".electron")
const node = document.querySelector(".node")
const chrome = document.querySelector(".chrome")

electron.innerHTML = "electron's version: "+versions.electron();
node.innerHTML = "node's version: "+versions.node();
chrome.innerHTML = "chrome's version: "+versions.chrome();