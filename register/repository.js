const { users } = require("../models")

async function createUser(user){
  return await users.create(user)
}

module.exports = {
    createUser
}