const { app, Tray, Menu, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const conser = require('./src/tools/conser');
const { DownloaderHelper } = require('node-downloader-helper');
const fs_ext = require('fs-extra');
const config = require('./src/tools/config');
const path = require('path');



const downloader = async (downloadUrl) => {
    try {
        await fs_ext.ensureDir(config.folderTemp);

        const downloader = new DownloaderHelper(downloadUrl, config.folderTemp, {
            override: true
        });

        downloader.on('progress', (stats) => {
            const speedBytesPerSecond = stats.speed;
            const progress = stats.progress.toFixed(2);
            const downloadedMB = (stats.downloaded / (1024 * 1024)).toFixed(2);
            const totalMB = (stats.total / (1024 * 1024)).toFixed(2);
            const speedMBps = (speedBytesPerSecond / (1024 * 1024)).toFixed(2);

            console.log(`Downloading: ${progress}% - ${downloadedMB}MB / ${totalMB}MB - speed ${speedMBps}MBPS`);
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