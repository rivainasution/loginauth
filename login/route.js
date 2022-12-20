const { login } = require("./business_rule");

const STATUS_BAD_REQUEST = 400
const STATUS_NOT_FOUND = 404

async function LoginRoute (req, res){
    const username= req.body.username;
    const password= req.body.password;

    if(!username){
        res.json({
            error:{
                code: STATUS_BAD_REQUEST,
                message: "USERNAME IS REQUIRED"
            }
        });
        return 
    }
    if(!password){
        res.json({
            error:{
                code: STATUS_BAD_REQUEST,
                message: "PASSWORD IS REQUIRED"
            }
        });
        return 
    }

    const token = await login(username, password);
    if(token instanceof Error){
        res.json({
            error:{
                code: STATUS_NOT_FOUND,
                message: token.message
            }
        })
        return
    }

    //date
    let dtAccessToken = new Date();
    dtAccessToken.setHours(dtAccessToken.getHours() + 24);

    let dtRefreshToken = new Date();
    dtRefreshToken.setDate(dtRefreshToken.getDay() + 30);

    //response
    res.json({
        success: true,
        data: {
            accessToken : {
            token: token.accessToken,
                expired: dtAccessToken.toLocaleDateString() + ' ' + dtAccessToken.toLocaleTimeString()
            },
            refreshToken : {
                token: token.refreshToken,
                expired: dtRefreshToken.toLocaleDateString() + ' ' + dtRefreshToken.toLocaleTimeString()
            }
        }
    })
}

module.exports = {
    LoginRoute
};

