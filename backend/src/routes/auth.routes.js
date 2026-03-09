const {Router} = require('express')
const authcontroller= require('../controller/auth.controller')
const authMiddleware=require('../middleware/auth.middleware')
const authUser = require('../middleware/auth.middleware')

const router= Router()

router.post("/register",authMiddleware,authcontroller.registerUser )
router.post("/login",authMiddleware,authcontroller.loginUser)
router.get('/get-Me',authMiddleware,authUser,authcontroller.getMe)
router.get('/logout',authMiddleware,authcontroller.logoutUser)
module.exports= router