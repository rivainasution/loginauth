const { hashPassword } = require("./business_rule");
const { createUser } = require("./repository");

const STATUS_BAD_REQUEST = 400
const STATUS_NOT_FOUND = 404

async function RegisterRoute (req, res, next){
    const username= req.body.username;
    const password= req.body.password;

    // if(!username){
    //     res.json({
    //         error:{
    //             code: STATUS_BAD_REQUEST,
    //             message: "USERNAME IS REQUIRED"
    //         }
    //     });
    //     return 
    // }
    // if(!password){
    //     res.json({
    //         error:{
    //             code: STATUS_BAD_REQUEST,
    //             message: "PASSWORD IS REQUIRED"
    //         }
    //     });
    //     return 
    // }

    // let user = {
    //     username: username,
    //     password: await hashPassword(password)
    // }

    // const signup = await createUser(user)

    res.json({
        success: true,
        message: "Register Success",
        data: signup
    });

}

module.exports = {
    RegisterRoute
};

