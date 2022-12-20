const { createHmac, scryptSync, createCipheriv, randomBytes, createDecipheriv } = require('node:crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { makeBuffer, isPasswordValid, createAccessToken } = require('../login/business_rule');
const { findUserById } = require('./repository');

const KEY_LEN = 64;
const IV_LEN = 12;
const ASSOC_LEN = 16;
const AUTHTAG_LEN = 16;
const CONFIG_SALT = 'ssmDF7cADuwzTdkX7CZ5FA==';
const ENCRYPTION_KEY = '2/6UYpScl1/Op37cvGQuUxEWUWSoeROFxnCMCNceDDw=';

async function refresh(token){
   // TODO: Verifikasi JWT Refresh Token. Valid or not
   const payload = verifyToken(token)
   // TODO: if not valid return new Error('invalid token') 
    if(payload instanceof Error){
        return payload;
    }
   // TODO: decrypt refresh token payload
   const credentialString = decryptChacha20Poly1305(payload);
   console.log('decrypt ', credentialString, 'type', typeof credentialString);
   
   // TODO: get userId, password from decrypted refresh token
   const credentialJSON = stringToJSON(credentialString);

    if(credentialJSON instanceof Error){
        return credentialJSON;
    }

   // TODO: get User from database by userId
    const user = await findUserById(credentialJSON.userid)
    if(null == user){
        return new Error('INVALID USER')
    }

    // TODO: validate password
    console.log({
        tokenpass: user.password,
        dbpass: credentialJSON.password
    })
    const isValid = isPasswordValid(makeBuffer(user.password), makeBuffer(credentialJSON.password))

   
    // TODO: if password not same return new Error('invalid password')
    if(!isValid) {
        return new Error('INVALID PASSWORD')
    }

   // TODO: generate new access token
   // TODO: return { accessToken }
   return newAccessToken = createAccessToken({
    userid: credentialJSON.userid,
    username: credentialJSON.username,

   })
}


function verifyToken(token) {
    try {
        return jwt.verify(token, config.secret)
    } catch (err) {
       return err
    }
}

function decryptChacha20Poly1305(enc){

    const decipher = createDecipheriv('chacha20-poly1305', makeBuffer(ENCRYPTION_KEY), makeBuffer(enc.salt), {authTagLength: AUTHTAG_LEN});
    
    decipher.setAAD(makeBuffer(enc.assocData)).setAuthTag(makeBuffer(enc.tag));

    let decrypt = decipher.update(enc.encrypt, 'base64', 'utf8');
    decrypt += decipher.final('utf8');

    return decrypt;
}

function stringToJSON(credentialString){
    try {
        return JSON.parse(credentialString);
    } catch (err) {
        return err
    }
}

module.exports = {
    refresh
}