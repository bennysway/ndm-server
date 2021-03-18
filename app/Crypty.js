var base64url = require('base64url')

function decrypt(v){
    // Todo: Add actual encryption
    return base64url.decode(v)
}

module.exports = {
    decrypt
}


