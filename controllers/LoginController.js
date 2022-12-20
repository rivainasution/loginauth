const db = require('../models');
var bcrypt = require('bcrypt');

const config = require('../config');
const jwt = require('jsonwebtoken');

const Users = db.users;


const register = async (req, res, next) => {

  
  let passwordHash = bcrypt.hashSync(req.body.password, 10);
  let user = {
    username: req.body.username,
    password: passwordHash
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
  
}

const logout = async (req, res, next) =>{
  req.session.destroy();

}
const getUser = async(req, res) => {
  try {
      const response = await Users.findAll();
      res.status(200).json(response);
  } catch (error) {
      console.log(error.message);
  }
}


module.exports = {
    register,
    logout, getUser
  };