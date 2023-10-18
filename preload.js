// EXAMPLE FOR PRELOAD .JS // Change it if you want
const {contextBridge,ipcRenderer} = require('electron')
// const os = require('os')
// const path = require('path')
// contextBridge.exposeInMainWorld('versions', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron
//   // we can also expose variables, not just functions
// })


const os = require('os')
const path = require('path')

contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir()
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args)
  // we can also expose variables, not just functions
  })

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel,data),
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
  // we can also expose variables, not just functions
})


const Roboto = require('@electron-fonts/roboto');

// Expose functions or variables to the renderer process
contextBridge.exposeInMainWorld('robot', {
  // You can add functions or variables here, for example:
  injectRobotoFont: () => {
    Roboto.inject();
  }
});