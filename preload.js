// EXAMPLE FOR PRELOAD .JS // Change it if you want
const {contextBridge} = require('electron')
const os = require('os')
const path = require('path')
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})
