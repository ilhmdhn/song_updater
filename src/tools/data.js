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

module.exports = {
    getOutlet,
    setOutlet
}