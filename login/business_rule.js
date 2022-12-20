const { findUser } = require("./repository");
const { createHmac, scryptSync, createCipheriv, randomBytes, createDecipheriv } = require('node:crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

const KEY_LEN = 64;
const IV_LEN = 12;
const ASSOC_LEN = 16;
const AUTHTAG_LEN = 16;
const CONFIG_SALT = 'ssmDF7cADuwzTdkX7CZ5FA==';
const ENCRYPTION_KEY = '2/6UYpScl1/Op37cvGQuUxEWUWSoeROFxnCMCNceDDw='

function convertBuffertoBase64(data){
    return Buffer.from(data).toString('base64');
}

function hash(password) {
    return scryptSync(password, salt(), KEY_LEN)
}

function salt() {
    return Buffer.from(CONFIG_SALT, 'base64')
}

function makeBuffer(string){
    return Buffer.from(string, 'base64')
}

function isPasswordValid(hashPasswordInput, hashPasswordDb){
    return hashPasswordInput.equals(hashPasswordDb) 
}

function createAccessToken(payload){
    return accessToken = jwt.sign(
        payload,
        config.secret, {
            expiresIn: '24h' // TODO: get expiration from configuration
        }
    )
}

function encryptChacha20Poly1305(payload){
    const iv = randomBytes(IV_LEN)
    const assocData = randomBytes(ASSOC_LEN)
    const cipher = createCipheriv('chacha20-poly1305', makeBuffer(ENCRYPTION_KEY), iv, {authTagLength: AUTHTAG_LEN});

    cipher.setAAD(assocData)

    let enc = cipher.update(payload, 'utf8', 'base64');
    enc += cipher.final('base64');

    const tag = cipher.getAuthTag();

    return{
        salt: convertBuffertoBase64(iv),
        assocData: convertBuffertoBase64(assocData),
        encrypt: enc,
        tag: convertBuffertoBase64(tag)
    }
}

function createRefreshToken(payload){
    const encryptPayload = encryptChacha20Poly1305(JSON.stringify(payload));

    return refreshToken = jwt.sign(
        encryptPayload,
        config.secret, {
            expiresIn: '30d' // TODO: get expiration from configuration
        }
    )
}

async function login(username, password){
    const user = await findUser(username)
    if(null == user){
        return new Error('USERNAME NOT FOUND')
    }

    const passwordHash = hash(makeBuffer(password));
    
    const userPassword = Buffer.from(user.password, 'base64');

    const isValid = isPasswordValid(passwordHash, userPassword);

    //Password Not Same
    if(!isValid) {
        return new Error('PASSWORD WRONG')
    }

    //payload
    let payload = {
        userid: user.id,
        username: username,
    }
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken({
        ...payload,
        password: passwordHash.toString('base64')
    })

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}




module.exports = {
    login,
    makeBuffer,
    salt,
    hash,
    isPasswordValid,
    createAccessToken
};

