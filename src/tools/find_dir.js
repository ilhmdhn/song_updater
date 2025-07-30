const { getSongList } = require("./data");

module.exports = (targetIds, excludeKeyword = '') => {
    const dirCount = {};
    const files = getSongList()
    console.log(`files ${JSON.stringify(files)}`);
    files.forEach(file => {
        console.log(`${targetIds} == ${file.id}`);
        if (!targetIds.includes(file.id)) return;
        const lastSlashIndex = file.dir.lastIndexOf('\\');
        if (lastSlashIndex === -1) return;

        const dir = file.dir.substring(0, lastSlashIndex + 1);

        // Lewati jika direktori mengandung kata yang ingin dihindari (like match)
        if (excludeKeyword && dir.toLowerCase().includes(excludeKeyword.toLowerCase())) {
            return;
        }

        dirCount[dir] = (dirCount[dir] || 0) + 1;
    });

    // Temukan direktori dengan jumlah paling banyak
    let maxDir = null;
    let maxCount = 0;

    for (const [dir, count] of Object.entries(dirCount)) {
        if (count > maxCount) {
            maxCount = count;
            maxDir = dir;
        }
    }

    return maxDir
        ? { directory: maxDir, count: maxCount }
        : { message: 'Tidak ditemukan direktori yang cocok', directory: null, count: 0 };
}