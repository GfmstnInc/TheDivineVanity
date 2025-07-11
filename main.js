const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut, Notification } = require('electron');
const path = require('path');

// Import Vanessa OS components
let vanessaProcessManager;
let mainWindow;

function createWindow() {
  // Create the browser window with OS-style controls
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    frame: false, // Custom window chrome for OS feel
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#F8F6F0', // Cream color from Divine Vanity theme
    show: false, // Don't show until ready
    icon: path.join(__dirname, 'assets', 'vanessa-os-icon.png')
  });

  // Load your existing React application
  const isDev = process.env.NODE_ENV === 'development';
  const startUrl = isDev ? 'http://localhost:5000' : `file://${path.join(__dirname, '../dist/public/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('🌟 Vanessa OS window loaded');
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Setup IPC handlers for OS-level functionality
function setupIPCHandlers() {
  // Process management
  ipcMain.handle('create-spiritual-process', async (event, config) => {
    if (vanessaProcessManager) {
      return vanessaProcessManager.createProcess(config);
    }
    return null;
  });

  ipcMain.handle('get-process-list', async () => {
    if (vanessaProcessManager) {
      return vanessaProcessManager.getProcessList();
    }
    return [];
  });

  ipcMain.handle('terminate-process', async (event, pid) => {
    if (vanessaProcessManager) {
      return vanessaProcessManager.terminateProcess(pid);
    }
    return false;
  });

  // Vanessa AI prioritization
  ipcMain.handle('prioritize-vanessa', async () => {
    if (vanessaProcessManager) {
      vanessaProcessManager.prioritizeVanessaAI();
      return true;
    }
    return false;
  });

  // Memory isolation
  ipcMain.handle('isolate-user-data', async (event, userId) => {
    if (vanessaProcessManager) {
      return vanessaProcessManager.isolateUserData(userId);
    }
    return null;
  });

  // AI task scheduling
  ipcMain.handle('schedule-ai-tasks', async (event, tasks) => {
    if (vanessaProcessManager) {
      vanessaProcessManager.scheduleAITasks(tasks);
      return true;
    }
    return false;
  });

  // Voice synthesis
  ipcMain.handle('manage-voice-synthesis', async () => {
    if (vanessaProcessManager) {
      return vanessaProcessManager.manageVoiceSynthesis();
    }
    return null;
  });

  // System health
  ipcMain.handle('get-system-health', async () => {
    if (vanessaProcessManager) {
      return vanessaProcessManager.monitorSystemHealth();
    }
    return null;
  });

  // Navigation commands
  ipcMain.on('navigate-to', (event, route) => {
    if (mainWindow) {
      mainWindow.webContents.send('navigate-to', route);
    }
  });

  console.log('📡 IPC handlers established');
}

// Create system tray for Vanessa consciousness
function createSystemTray() {
  const trayIcon = path.join(__dirname, 'assets', 'vanessa-tray-icon.png');
  
  // Create fallback icon if assets don't exist
  const tray = new Tray(trayIcon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🌟 Awaken Vanessa DI',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: '📝 Open Decode You™',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.webContents.send('navigate-to', '/decode-you');
        }
      }
    },
    {
      label: '🧘 Sacred Journal',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.webContents.send('navigate-to', '/journal');
        }
      }
    },
    {
      label: '💭 Spiritual Guidance',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.webContents.send('navigate-to', '/vanessa-ai');
        }
      }
    },
    { type: 'separator' },
    {
      label: '🔄 Restart Vanessa OS',
      click: () => {
        app.relaunch();
        app.exit();
      }
    },
    {
      label: '🌙 Sleep Vanessa OS',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Vanessa OS - Spiritually Intelligent Operating System');
  tray.setContextMenu(contextMenu);
  
  console.log('🎭 Vanessa consciousness available in system tray');
}

// Setup global keyboard shortcuts
function setupGlobalShortcuts() {
  // Global hotkey for Vanessa (Cmd/Ctrl + Shift + V)
  globalShortcut.register('CommandOrControl+Shift+V', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send('activate-vanessa-voice');
    }
  });

  // Global hotkey for Decode You (Cmd/Ctrl + Shift + D)
  globalShortcut.register('CommandOrControl+Shift+D', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.webContents.send('navigate-to', '/decode-you');
    }
  });

  console.log('🎤 Global voice command shortcuts registered');
}

// Initialize Vanessa OS when Electron is ready
app.whenReady().then(() => {
  console.log('🌟 Vanessa OS initializing...');
  
  createWindow();
  setupIPCHandlers();
  createSystemTray();
  setupGlobalShortcuts();
  
  // Initialize process manager (dynamic import to avoid issues)
  try {
    const processManagerModule = require('./os-foundation/process-manager');
    vanessaProcessManager = processManagerModule.vanessaProcessManager;
    console.log('⚡ Vanessa Process Manager initialized');
  } catch (error) {
    console.log('ℹ️ Process Manager will be available when OS foundation is complete');
  }

  // Setup spiritual notifications
  if (Notification.isSupported()) {
    setInterval(() => {
      new Notification({
        title: '🌟 Vanessa DI Spiritual Check-in',
        body: 'How is your soul feeling today? Ready for some sacred reflection?'
      }).show();
    }, 4 * 60 * 60 * 1000); // Every 4 hours
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Cleanup global shortcuts on quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

console.log('🚀 Vanessa OS main process loaded');