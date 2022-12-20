function getUsername(Users, req){
    Users.findOne({
        where: {
          username: req.body.username
        }
    })
}


module.exports = {
    getUsername
};