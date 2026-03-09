const userModel = require('../model/user.model')
const blacklistModel = require('../model/blacklist.model')

const jwt = require('jsonwebtoken')

async function authUser(req,res,next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message:"token not provided"
        })
    }
    const isTokenBlacklisted = await blacklistModel.findOne({
        token
    })

    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"invalid token"
        })
    }
    try{
        const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY,
    )
    req.user =decoded
    next()
    } catch(err){
        return res.status(401).json({
            message:"invalid token"
        })
    }
   
}

module.exports = authUser