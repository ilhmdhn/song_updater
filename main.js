const { app, Tray, Menu, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const conser = require('./src/tools/conser');
const { DownloaderHelper } = require('node-downloader-helper');
const fs = require('fs').promises;
const config = require('./src/tools/config');
const path = require('path');
const dataDummy = require('./src/tools/dummy');
let win;

const fsStandard = require('fs');
const path = require('path');
const { promisify } = require('util');
const stat = promisify(fs.stat);

const moveWaitingListMain = [];
const moveWaitingListSecondary = [];

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
            nodeIntegration: false,
            contextIsolation: true,
            zoomFactor: 1,
            scrollBounce: false,
            preload: path.join(__dirname, '/renderer/src/preload.js')
        },
        enableRemoteModule: true
    });

    win.loadFile(path.join(__dirname, 'renderer/dist/index.html'));
    win.openDevTools();
}

const downloader = async (song) => {
    try {
        try {
            await fs.mkdir(config.folderTemp, { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') throw err;
        }
        const downloadUrl = `${config.storageUrl}/${song.url}`;
        console.log(downloadUrl);
        const downloader = new DownloaderHelper(downloadUrl, config.folderTemp, {
            override: true
        });

        downloader.on('progress', (stats) => {
            const currentRawSpeed = stats.speed;

            // if (currentRawSpeed !== lastSentSpeedMBps) {
            if (true) {
                const speedBytesPerSecond = stats.speed;
                const progress = stats.progress.toFixed(2);
                // const downloadedMB = (stats.downloaded / (1024 * 1024)).toFixed(2);
                // const totalMB = (stats.total / (1024 * 1024)).toFixed(2);
                const speedMBps = (speedBytesPerSecond / (1024 * 1024)).toFixed(2);

                win.webContents.send('SEND-DOWNLOAD-PROGRESS', {
                    state: 'DOWNLOADING',
                    downloadPercent: progress,
                    downloadSpeed: speedMBps + 'MB/s',
                    movePercent: 0,
                    location: song.location,
                    url: song.url,
                    fileName: song.fileName
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
        return true;
    } catch (error) {
        conser('downloader', error);
        return false;
    }
}

const sendLogError = (error) => {
    win.webContents.send('update-error-log', error);
}

const sendCurrentOutletCode = (outletCode) => {
    win.webContents.send('current-outlet-code', outletCode);
}

const sendUpdateAvailableList = (list) => {
    win.webContents.send('update-available-list', list);
}

const addSongItemList = (songList) => {
    win.webContents.send('add-song-item-list', songList);
}

const startProgressUpdate = async (songList) => {
    try {
        songList.forEach(element => {
            element.state = 'WAITING';
            element.downloadPercent = 0;
            element.downloadSpeed = '0MB/ps';
            element.movePercent = 0;
        });

        addSongItemList(songList);
        for (song of songList) {
            await downloader(song);
            song.state = 'WAITING_MOVE';
            win.webContents.send('SEND-MOVE-QUEUE', song);
            moveWaitingListMain.push(song);
        }
    } catch (error) {

    }
}

ipcMain.on('send-outlet-code', (event, data) => {
    console.log('Kode outlet dikirim:', data);
    startProgressUpdate(dataDummy);
});

setInterval(() => {
    copyFileWithProgressMain();
    copyFileWithProgressSecondary();
}, 5000);

let processingCopyMain = false;
const copyFileWithProgressMain = async () => {
    if (processingCopyMain) return;
    if (moveWaitingListMain.length == 0) return;
    const song = moveWaitingListMain[0];
    const src = song.src; // dipikir nanti
    const dest = song.dest; // dipikir nanti
    processingCopyMain = true;

    try {
        const totalSize = (await stat(src)).size;
        let copiedSize = 0;

        await new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(src);
            const writeStream = fs.createWriteStream(dest);

            readStream.on('data', (chunk) => {
                copiedSize += chunk.length;

                const percent = ((copiedSize / totalSize) * 100).toFixed(2);
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                process.stdout.write(`Progress: ${percent}%`);
            });

            readStream.on('error', reject);
            writeStream.on('error', reject);
            writeStream.on('finish', () => {
                process.stdout.write('\nCopy completed!\n');
                const index = moveWaitingListMain.findIndex(item => item.fileName === song.fileName);
                moveWaitingListMain.splice(index, 1);
                moveWaitingListSecondary.push(song);
                resolve();
            });

            readStream.pipe(writeStream);
        });
    } catch (error) {
        sendLogError(`Gagal memindah ke main server ${song.fileName} ${error.message}`);
    } finally {
        processingCopyMain = false;
    }
}

let processingCopySecondary = false;
const copyFileWithProgressSecondary = async () => {
    if (processingCopySecondary) return;
    if (moveWaitingListSecondary.length == 0) return;
    const song = moveWaitingListSecondary[0];
    const src = song.src; // dipikir nanti
    const dest = song.dest; // dipikir nanti
    processingCopySecondary = true;
    try {
        const totalSize = (await stat(src)).size;
        let copiedSize = 0;

        await new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(src);
            const writeStream = fs.createWriteStream(dest);

            readStream.on('data', (chunk) => {
                copiedSize += chunk.length;

                const percent = ((copiedSize / totalSize) * 100).toFixed(2);
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                process.stdout.write(`Progress: ${percent}%`);
            });

            readStream.on('error', reject);
            writeStream.on('error', reject);
            writeStream.on('finish', () => {
                process.stdout.write('\nCopy completed!\n');
                resolve();
            });

            readStream.pipe(writeStream);
        });
    } catch (error) {
        sendLogError(`Gagal memindah ke secondary server ${song.fileName} ${error.message}`);
    } finally {
        const index = moveWaitingListSecondary.findIndex(item => item.fileName === song.fileName);
        moveWaitingListSecondary.splice(index, 1);
        processingCopySecondary = false;
    }
}

app.whenReady().then(() => {
    createWindow();
});