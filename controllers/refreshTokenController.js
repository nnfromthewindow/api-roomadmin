const User = require('../models/User')
const jwt = require ('jsonwebtoken')

const handleRefreshToken = async(req,res) =>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt
    res.clearCookie('jwt', {httpOnly:true, sameSite:'None', secure:true})

    const user = await User.findOne({refreshToken}).exec()

    if(!user){
    
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async(err,decoded)=>{
                if(err) return res.sendStatus(403)
                console.log('attempted refresh token reuse!')
                const hackedUser = await User.findOne({username:decoded.username}).exec()
                hackedUser.refreshToken = []
                const result = hackedUser.save()
                console.log(result);
            }
        )
        return res.sendStatus(403);
    }

    const newRefreshTokenArray = user.refreshToken.filter(rt => rt!== refreshToken)

    jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded)=>{
                if(err){
                    console.log('expired refresh token')
                    user.refreshToken = [...newRefreshTokenArray]
                    const result = await user.save()
                    console.log(result)
                }
                if(err || user.username !== decoded.username ) return res.sendStatus(403)

                const roles = Object.values(user.roles)
                const accessToken = jwt.sign(
                    {
                        "UserInfo":{
                            "username":decoded.username,
                            "roles": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn:'10m'}
                    )

                    const newRefreshToken = jwt.sign(
                        {"username": user.username},
                        process.env.REFRESH_TOKEN_SECRET,
                        {expiresIn: '1d'}
                    )

                    user.refreshToken = [...newRefreshTokenArray, newRefreshToken]
                    const result = await user.save()

                    res.cookie('jwt', newRefreshToken,{httpOnly:true, secure:true, sameSite:'None',maxAge:24 * 60 * 60 * 1000})

                    res.json({accessToken, roles})
            }
        )
}

module.exports = {handleRefreshToken}