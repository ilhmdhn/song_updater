const fs = require('fs').promises; // Menggunakan versi promises
const crypto = require('crypto');
const path = require('path');

const checkDir = async (ip) => {
    try {
        const tempFileName = `electron_test_${crypto.randomBytes(8).toString('hex')}.tmp`;
        const tempFilePath = path.join(ip, tempFileName);
        const testContent = 'Ini adalah konten tes dari Electron Downloader.';

        console.log(`[${new Date().toISOString()}] Mencoba memeriksa akses ke direktori: ${ip}`);

        // fs.promises.access() will throw an error if the path is not accessible.
        // fs.constants.F_OK checks if the path is visible to the process.
        await fs.access(ip, fs.constants.F_OK);

        console.log(`[${new Date().toISOString()}] Akses berhasil! Direktori dapat dijangkau.`);
        return true;

        // console.log('Mencoba menulis...');
        // await fs.writeFile(tempFilePath, testContent, 'utf8');
        // console.log('Menulis berhasil. Mencoba membaca...');

        // --- Perhatikan ini ---
        // const readContent = await fs.readFile(tempFilePath, 'utf8');
        // console.log(`Membaca berhasil. Konten: ${readContent}`);

        // console.log('Mencoba menghapus...');
        // await fs.unlink(tempFilePath);
        // console.log('Menghapus berhasil.');

        // return true;
    } catch (error) {
        console.error(`
            Error: ${error}
            message: ${error.message}
            stack: ${error.stack}
        `);
        throw error
    }
}

checkDir('\\\\192.168.1.136\\db')

module.exports = {
    checkDir
}