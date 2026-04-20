const express= require('express')
const cookieParser= require("cookie-parser")
const app = express()

app.use(express.json())
app.use(cookieParser())

const songRoutes = require('./routes/song.routes');
app.use('/api', songRoutes);

module.exports=app