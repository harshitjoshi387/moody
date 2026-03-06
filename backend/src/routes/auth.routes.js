const {Router} = require('express')
const authcontroller= require('../controller/auth.controller')

const router= Router()

router.post("/register",authcontroller.registerUser )
module.exports= router