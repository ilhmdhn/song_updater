const config = require('./config');
const fs_ext = require('fs-extra');

const downloadDir = async () => {
    try {
        await fs_ext.ensureDir(config.folderTemp);
    } catch (error) {
        console.error(`
            ERROR createDownloadDir
            error: ${error}
            message: ${error.message}
            stack: ${error.stack}
        `)
    }
}

const cleanDownloadTemp = () => {

}

downloadDir()

module.exports = {
    downloadDir,
    cleanDownloadTemp
}