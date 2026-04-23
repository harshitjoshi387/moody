const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// THEN others
app.use(express.json());
app.use(cookieParser());
app.get("/test", (req, res) => {
  res.send("CORS working");
});
const songRoutes = require('./routes/song.routes');
const authRoutes = require('./routes/auth.routes');

app.use('/api/songs', songRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;