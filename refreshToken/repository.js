const { users } = require("../models")

async function findUserById(userid){
  return await users.findOne({
    where: {
      id: userid
    }
  })
}

module.exports = {
    findUserById
}