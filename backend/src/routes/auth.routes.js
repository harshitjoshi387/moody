const {Router} = require('express')
const authcontroller= require('../controller/auth.controller')
const authMiddleware=require('../middleware/auth.middleware')

const router= Router()

router.post("/register",authcontroller.registerUser )
router.post("/login",authcontroller.loginUser)
router.get('/get-Me',authcontroller.getMe)
module.exports= router