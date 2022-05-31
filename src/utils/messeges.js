const generatemessege = (username, text) => {
    return {
        username,
        text,
        createdat: new Date().getTime()
    }
}
const generatemessegelocation = (username, url) => {
    return {
        username,
        url,
        createdat: new Date().getTime()
    }
}
module.exports = {
    generatemessege,
    generatemessegelocation
}