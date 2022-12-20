const { users } = require("../models")

async function findUser(username){
    return await users.findOne({
        where: {
          username: username
        }
      })
}

module.exports = {
    findUser
}