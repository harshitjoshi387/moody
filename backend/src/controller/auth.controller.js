const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../model/blacklist.model");
const userModel = require("../model/user.model");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.JWT_SECRECT ||
  process.env.JWT_SECRET_KEY;

function buildToken(user, expiresIn = "90d") {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn }
  );
}

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  });
}

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email and password are required",
      });
    }

    const isAlreadyRegistered = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isAlreadyRegistered) {
      return res.status(400).json({
        message: "user with the same email or username already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    const token = buildToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      message: "user registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to register user",
      error: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({
        message: "email or username and password are required",
      });
    }

    const user = await userModel
      .findOne({
        $or: [email ? { email } : null, username ? { username } : null].filter(
          Boolean
        ),
      })
      .select("+password");

    if (!user) {
      return res.status(400).json({
        message: "invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "invalid credentials",
      });
    }

    const token = buildToken(user, "90d");
    setAuthCookie(res, token);

    return res.status(200).json({
      message: "user logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to login user",
      error: error.message,
    });
  }
}

async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to fetch user",
      error: error.message,
    });
  }
}

async function logoutUser(req, res) {
  try {
    const token = req.cookies.token;

    if (token) {
      await blacklistModel.create({ token });
    }

    res.clearCookie("token");
    return res.status(200).json({
      message: "logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to logout user",
      error: error.message,
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};
