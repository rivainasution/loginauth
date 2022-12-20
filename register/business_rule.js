const { hash, makeBuffer } = require("../login/business_rule");

async function hashPassword(password){
  return hash(makeBuffer(password)).toString('base64') 
}

module.exports = {
    hashPassword
};

