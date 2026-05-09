const { app, BrowserWindow } = require('electron');
const path = require('path');

// 禁用硬件加速，避免某些电脑上的问题
app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    // 默认居中显示
    center: true
  });

  // 加载 index.html（游戏入口页面）
  mainWindow.loadFile('index.html');

  // 开发时打开开发者工具
  // mainWindow.webContents.openDevTools();

  // 窗口关闭时退出应用
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 应用准备就绪时创建窗口
app.whenReady().then(() => {
  createWindow();

  // macOS 下需要保持应用活跃
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
