const { Router } = require("express");
const authController = require("../controller/auth.controller");
const authUser = require("../middleware/auth.middleware");

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

router.get("/me", authUser, authController.getMe);
router.get("/get-Me", authUser, authController.getMe);

router.post("/logout", authUser, authController.logoutUser);
router.get("/logout", authUser, authController.logoutUser);

module.exports = router;
