const cors = require("cors");
const express= require('express')
const cookieParser= require("cookie-parser")
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const songRoutes = require('./routes/song.routes');
app.use('/api/songs', songRoutes);

module.exports=app