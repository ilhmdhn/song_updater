const { postSong } = require("../network/axios");
const conser = require("../tools/conser");
const { setSongList } = require("../tools/data");
const date_to_string = require("../tools/date_to_string");
const diskCheckTools = require('../tools/disk_check');
const find_dir = require("../tools/find_dir");
const mapping_dir = require("../tools/mapping_dir");
const normalize_name = require("../tools/normalize_name");

const diskCheck = async () => {
    try {
        const diskInfo = await diskCheckTools('192.168.1.201');
        const list = [];
        const mappingDir = [];

        for (file of diskInfo.songList) {
            mappingDir.push({
                id: normalize_name(file.fileName),
                dir: file.dir
            });
            list.push({
                outlet: 'HP000',
                file: file.fileName,
                location: file.dir,
                date_modified: date_to_string(file.date_modified),
                vod_version: '2',
                server: 'main',
            });
        }

        setSongList(mappingDir);
        const dir = find_dir('1');
        console.log(dir)
        // console.log(`Start post song ${list.length}`)
        // postSong(list);

    } catch (error) {
        conser('diskCheck', error);
    }
}

module.exports = {
    diskCheck
}