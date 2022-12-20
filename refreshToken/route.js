const { refresh } = require("./business_rule");

const STATUS_BAD_REQUEST = 400

async function refreshRoute(req, res){

    const refreshToken = req.body.refreshToken;

    if(!refreshToken){
        res.json({
            error:{
                code: STATUS_BAD_REQUEST,
                message: "REFRESH TOKEN IS REQUIRED"
            }
        });
        return 
    }

    const token = await refresh(refreshToken)
    if (token instanceof Error) {
        res.json({
            error: {
                code: STATUS_BAD_REQUEST,
                message: token.message
            }
        })
        return
    }

    res.json({
        success: true,
        data: {
            accessToken : {
            token: token
            }
        }
    })

}

module.exports ={
    refreshRoute
}