const {app, BrowserWindow} = require('electron');
var ipc = require('electron').ipcMain;
var fs = require('fs');
var path = "/Users/msnr/Dropbox/Photos"; //初期値
var filePath = "";
var album = [];
var index = 0;
let regexp = /.*\.(jpg|jpeg|png|gif)$/i;


var win = null;
app.on('ready', function() {
  win = new BrowserWindow({width:800, height:600});
  win.loadURL(`file://${__dirname}/index.html`);
  win.on('closed', function() {
  mainWindow = null;
  });
});

function fileRead() {
  album = fs.readdirSync(path);
  album = album.filter(function(file) {
    return regexp.test(file);
  });
  filePath = path + "/" + album[index];
  console.log(filePath);
  index += 1;
  if (index >= album.length) {
    index = 0;
  }
}

ipc.on('mul-async', function(event) {
  // console.log(arg);
  fileRead();
  event.sender.send('mul-async-replay', filePath);
});

ipc.on('mul-async-dialog', function(event, arg) {
    // console.log(arg[0]);
    if (!arg) {return;} // cancel selected
    path = arg[0];
    index = 0;
    fileRead();
    event.sender.send('mul-async-dialog-replay', filePath);
  }
);
