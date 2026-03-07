const userModel=require("../model/user.model")
const bcrypt = requirw ("bcryptjs")
const jwt = require("jsonwebtoken")


async function registerUser(req,res){
    const{username,email,password}=req.body
    const isAlreadyRegistered = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })
    if(isAlreadyRegistered){
        return res.status(400).json({
            message:"user with the same email or username already exists"
        })
    }
    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash
    })
    const token = jwt.sign({
        id:user._id,
        username:user.username
    },process.env.JWT_SECRET,
    {
        expiresIn:"7d"
    }
)
res.cookie("token",token)
 
return res.status(201).json({
    message:"user register sucessfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email
    }
})
}
async function loginUser(req,res){
    const{username,email,password}=req.body

    const user= await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(!user){
        return res.status(400).json({
            message:"invalid credentials"
        })
    }
    const token = jwt.sign(
        {
            id:user._id,
            username:user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"3d"
        }
    )

    res.cookie= ("token",token)

    return res.status(200).json({
        message:"user logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}
async function getMe( req,res){
    const user = await userModel.findById(req.user.id)
}

module.exports= {
    registerUser,
    loginUser,
    getMe

}