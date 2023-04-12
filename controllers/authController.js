const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const login = async(req,res)=>{

const cookies = req.cookies

const{username,password} = req.body

if(!username||!password){
    return res.status(400).json({message:'All fields are required'})
}

const user = await User.findOne({username}).exec()

if(!user){
    return res.sendStatus(401)
}

const match = await bcrypt.compare(password, user.password)


if(match){

    const roles = Object.values(user.roles).filter(Boolean)

    const accessToken = jwt.sign(
        {
            "UserInfo":{
                "username": user.username,
                "roles": roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'15m'}
        )
    
    const newRefreshToken = jwt.sign(
            {"username": user.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        )

    let newRefreshTokenArray = !cookies?.jwt ? user.refreshToken : user.refreshToken.filter(rt=>rt!==cookies.jwt)

    if(cookies?.jwt){
        const refreshToken = cookies.jwt
        const token = await User.findOne({refreshToken}).exec()

        if(!token){
            console.log('attempted refresh token reuse at login!')
        
            newRefreshTokenArray = [];
        }
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    }
    user.refreshToken = [...newRefreshTokenArray,newRefreshToken]
    const result = await user.save()
    console.log(result);
    console.log(roles);

    res.cookie('jwt', newRefreshToken,{httpOnly:true, secure: true, sameSite:'None', maxAge: 24 * 60 * 60 * 1000 })

    res.json({accessToken, roles})
} else {
    res.sendStatus(401)
}

}

const refresh = async(req,res) =>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt
    res.clearCookie('jwt', {httpOnly:true, sameSite:'None', secure:true})

    const user = await User.findOne({refreshToken}).exec()
    console.log(user)
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

const logout = async(req,res)=>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    const refreshToken = cookies.jwt
    const user = await User.findOne({refreshToken}).exec()
    if(!user){
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus(204)
    }
    user.refreshToken = user.refreshToken.filter(rt=> rt!== refreshToken)
    const result = await user.save()
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.sendStatus(204)
}


module.exports = {
    login,
    logout,
    refresh
}