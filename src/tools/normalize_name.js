module.exports = (str) => {
    let s = String(str);
    if (/[ABP]$/i.test(s)) {
        s = s.slice(0, -1);
    }

    s = s.replace(/^0+/, '');
    return s.trim();
}