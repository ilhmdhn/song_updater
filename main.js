const { app, Tray, Menu, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const conser = require('./src/tools/conser');
const { DownloaderHelper } = require('node-downloader-helper');
const fs = require('fs').promises;
const config = require('./src/tools/config');
const path = require('path');
const { diskCheck } = require('./src/controller/disk-controller');
let win;
let lastSentSpeedMBps = null;

const createWindow = () => {
    const additionalData = { myKey: 'song_update' };
    const gotTheLock = app.requestSingleInstanceLock(additionalData);
    if (!gotTheLock) {
        app.isQuiting = true;
        app.quit();
        app.exit();
        return
    }

    win = new BrowserWindow({
        width: 1020,
        height: 675,
        resizable: false,
        show: true,
        icon: path.join(__dirname, '/icon.png'),
        title: "Update Lagu",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            zoomFactor: 1,
            scrollBounce: false,
        },
        enableRemoteModule: true
    });

    win.loadFile(path.join(__dirname, './src/page/index.html'));
    win.openDevTools();
    // diskCheck()
    downloader('https://drive.google.com/uc?id=1ktGYunHNPQrebMENTTcJR5HZsDkPoub7&export=download')

}

const downloader = async (downloadUrl) => {
    try {
        // await fs.ensureDir(config.folderTemp);
        // await fs.mkdir(config.folderTemp);

        const downloader = new DownloaderHelper(downloadUrl, config.folderTemp, {
            override: true
        });

        downloader.on('progress', (stats) => {
            const currentRawSpeed = stats.speed;

            // if (currentRawSpeed !== lastSentSpeedMBps) {
            if (true) {
                const speedBytesPerSecond = stats.speed;
                const progress = stats.progress.toFixed(2);
                const downloadedMB = (stats.downloaded / (1024 * 1024)).toFixed(2);
                const totalMB = (stats.total / (1024 * 1024)).toFixed(2);
                const speedMBps = (speedBytesPerSecond / (1024 * 1024)).toFixed(2);

                console.log(`Downloading: ${progress}% - ${downloadedMB}MB / ${totalMB}MB - speed ${speedMBps}MBPS`);

                win.webContents.send('SEND-DOWNLOAD-PROGRESS', {
                    percent: progress,
                    speed: speedMBps,
                    downloaded: downloadedMB,
                    size: totalMB,
                    file: 'ngarit.3gp'
                });
                lastSentSpeedMBps = currentRawSpeed;
            }
        });

        downloader.on('error', (err) => {
            conser('download', err);
        });

        downloader.on('end', async (downloadInfo) => {
            const downloadedFilePath = downloadInfo.filePath;
            const downloadedFileName = path.basename(downloadedFilePath);
            console.log(`Download selesai: ${downloadedFilePath}`);
        });

        await downloader.start();

    } catch (error) {
        return conser('downloader', error);
    }
}

app.whenReady().then(() => {
    createWindow();
});