module.exports = (files) => {
    const folderMap = {};

    files.forEach(file => {
        // Ambil path direktori tempat file berada (dengan trailing slash)
        const lastSlashIndex = file.dir.lastIndexOf('\\');
        if (lastSlashIndex === -1) return;

        const fullDir = file.dir.substring(0, lastSlashIndex + 1);

        // Ambil digit pertama dari ID (group)
        const idGroupMatch = file.id.match(/^(\d)/);
        if (!idGroupMatch) return;

        const group = idGroupMatch[1];

        // Inisialisasi jika belum ada
        if (!folderMap[fullDir]) {
            folderMap[fullDir] = {};
        }

        // Hitung jumlah masing-masing grup
        folderMap[fullDir][group] = (folderMap[fullDir][group] || 0) + 1;
    });

    // Tentukan grup mayoritas untuk setiap direktori
    const result = {};
    for (const [dir, groups] of Object.entries(folderMap)) {
        const majorGroup = Object.entries(groups).sort((a, b) => b[1] - a[1])[0][0];
        result[dir] = majorGroup;
    }

    return result;
}
