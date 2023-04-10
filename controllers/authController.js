const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const login = async(req,res)=>{
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
const cookies = req.cookies

const{username,password} = req.body

if(!username||!password){
    return res.status(400).json({message:'All fields are required'})
}

const user = await User.findOne({username}).exec()

if(!user){
    return res.status(401).json({message:'Unauthorized'})
}

const match = await bcrypt.compare(password, user.password)

//if (!match) return res.status(401).json({ message: 'Unauthorized' })
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

/*
const accessToken = jwt.sign({  

    "UserInfo":{
        "username":user.username,
        "roles": user.roles    
        }
    }
    ,
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:'15m'})

const refreshToken = jwt.sign(
    {'username':user.username},
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: '7d'}
    )

res.cookie('jwt',refreshToken,{
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000
})

res.json({accessToken})
}
*/
}
const refresh = async(req,res)=>{
    const cookies = req.cookies

    if(!cookies?.jwt) return res.status(401).json({message: 'Unauthorized'})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async(err, decoded)=>{
        if(err) return res.status(403).json({message:'Forbidden'})
        
        const user = await User.findOne({username: decoded.username}).exec()

        if(!user) return res.status(401).json({message:'Unauthorized'})

        const accessToken = jwt.sign(
            {
                "UserInfo":{
                "username": user.username,
                "roles":user.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'15m'}
        )
        res.json({accessToken})
        }
    )
}

const logout = (req,res)=>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt',{httpOnly:true,sameSite:'None', secure:true})
    res.json({message:'Cookie cleared'})
}

module.exports = {
    login,
    refresh,
    logout
}