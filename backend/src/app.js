const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();


const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://moodify-frontend.vercel.app" // User should add their actual Vercel link here
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

app.get("/", (req, res) => {
  res.json({ message: "Moodify Backend is running" });
});


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