const conser = require('./conser');
const fs = require('fs').promises;
const path = require('path');


const listSharedFolderContents = async (shareFolderPath) => {
    try {
        const contents = await fs.readdir(shareFolderPath);
        return contents;
    } catch (error) {
        console.error(`
            [${new Date().toISOString()}] Gagal membaca isi folder '${shareFolderPath}'.
            Kemungkinan penyebab:
            - Folder tidak ditemukan di jaringan.
            - Tidak ada izin baca (read permission) untuk proses ini.
            - Jalur (path) tidak valid atau salah format.
            
            Detail Error: ${error.message}
            Stack: ${error.stack}
        `);
        throw new Error(`Failed to list contents of '${shareFolderPath}': ${error.message}`);
    }
};

const diskCheck = async (ip) => {
    try {
        const storageInfo = [];
        const otherStorage = [];
        const folders = await listSharedFolderContents(`\\\\${ip}\\data`);
        let songFiles = [];
        for (const dir of folders) {
            if (dir === 'DISKA' || !dir.includes('DISK')) continue;

            let usage = 0;
            const directory = `\\\\${ip}\\data\\${dir}\\PARTITION1`;
            const files = await fs.readdir(directory);

            for (const item of files) {
                const fileFullPath = path.join(directory, item);
                const detail = await fs.stat(fileFullPath);
                if (detail.isDirectory()) {
                    const sambungan = await dirCheck(fileFullPath);
                    otherStorage.push(fileFullPath);
                    otherStorage.push(...sambungan.other_storage);
                    songFiles.push(...sambungan.song);
                    usage += sambungan.usage;
                } else if (detail.isFile()) {
                    songFiles.push({
                        fileName: item,
                        dir: fileFullPath,
                        date_modified: detail.mtime
                    });
                    usage += detail.size;
                }
            }

            storageInfo.push({
                dir: dir,
                usage: usage / 1_000_000_000
            });
        }

        return {
            songList: songFiles,
            storageInfo: storageInfo,
            otherStorage: otherStorage
        };
    } catch (error) {
        conser('testtt', error);
    }
}

const dirCheck = async (dir) => {
    try {
        const files = await fs.readdir(dir);
        let songFiles = [];
        const otherStorage = [];
        let usage = 0;

        for (const item of files) {
            const fileFullPath = path.join(dir, item);
            const detail = await fs.stat(fileFullPath);
            if (detail.isDirectory()) {
                const sambungan = await dirCheck(fileFullPath);
                otherStorage.push(fileFullPath);
                otherStorage.push(...sambungan.other_storage)
                songFiles.push(...sambungan.song);
                usage += sambungan.usage;
            } else if (detail.isFile()) {
                songFiles.push({
                    fileName: item,
                    dir: fileFullPath,
                    date_modified: detail.mtime
                });
                usage += detail.size;
            }
        }

        return {
            song: songFiles,
            usage: usage,
            other_storage: otherStorage
        };
    } catch (error) {
        conser('dirCheck', error);
        return { song: [], usage: 0 };
    }
}


module.exports = diskCheck;