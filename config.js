const fs = require('fs');

let key= fs.readFileSync('C:/Users/rivai/OneDrive/Desktop/loginauth/certs/key.pem');

module.exports = {
    secret:key
}