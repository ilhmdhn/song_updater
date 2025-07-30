const Store = require('electron-store');
const store = new Store();

const getOutlet = () => {
    return {
        ip: store.get('outlet')
    };
};

const setOutlet = (outlet,) => {
    store.set('outlet', outlet);
};

const getSongList = () => {
    return store.get('songs');
}

const setSongList = (songs) => {
    store.set('songs', songs);
}

const addSongList = (song) => {
    const currentList = getSongList()
    currentList.push(song);
    setSongList(currentList);
}

module.exports = {
    getOutlet,
    setOutlet,
    getSongList,
    setSongList,
    addSongList
}