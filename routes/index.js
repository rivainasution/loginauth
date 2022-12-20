var express = require('express');
var router = express.Router();
const db = require('../models');
const { scryptSync } = require('node:crypto');

const config = require('../config');
const jwt = require('jsonwebtoken');

const Users = db.users;


const loginController = require("../controllers/LoginController");

/* Login. */
router.post('/login', function (req, res, next){

  Users.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(data => {
    if (data) {
      const passwordInput = req.body.password;
      const passwordDatabase = data.password;

      const passwordIn = stringBuffer(passwordInput);
      const passwordDb = stringBuffer(passwordDatabase);
        
      const hashPasswordInput = hash(passwordIn);
      const hashPasswordDatabase = hash(passwordDb);

      const isValid = isPasswordValid(hashPasswordInput.toString('base64'), hashPasswordDatabase.toString('base64'));

      if (isValid) {
        // payload
        let payload = {
          userid: data.id,
          username: req.body.username
        };
        
        //token
        let token = jwt.sign(
          payload,
          config.secret, {
            expiresIn: '12h'
          }
        )

        //date
        let dt = new Date();
        dt.setHours(dt.getHours() + 12);

        //response
        res.json({
          success: true,
          data: {
            accessToken : {
                token: token,
                expired: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString()
            },
            refreshToken : {
              token: token,
              expired: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString()
            }
          }
          
        });
      } else {
        res.json({
          message: "password Salah"
        })
      }
    } else {
      res.json({
        message: "username Salah"
      });
    }
  })
  .catch(err => {
    res.json({
      message: "username dan password Salah"
    });
  });
});

const KEY_LEN = 64
const CONFIG_SALT = 'ssmDF7cADuwzTdkX7CZ5FA==';

function hash(password) {
      return scryptSync(password, salt(), KEY_LEN)
}
var bcrypt = require('bcrypt');


function salt() {
      return Buffer.from(CONFIG_SALT, 'base64')
}

function stringBuffer(string){
  return Buffer.from(string, 'base64')
}
function isPasswordValid(hashPasswordDatabase, hashPasswordInput){
  return hashPasswordDatabase.equals(hashPasswordInput);
}
/* Regis. */
router.post('/register', function(req, res, next){
  const passwordInput = req.body.password;
  
  const passwordIn = stringBuffer(passwordInput);
    
  const hashPasswordInput = hash(passwordIn);

  let user = {
    username: req.body.username,
    password: hashPasswordInput.toString('base64')
  }
  Users.create(user)
    .then(data => {
      res.send({
        message: "Berhasil Registrasi"
      });
    })
    .catch(err => {
      res.json({
        info: "Error",
        message: err.message
      });
    });
});
/* Login. */
router.get('/logout', loginController.logout);

router.get('/user', loginController.getUser);


module.exports = router;