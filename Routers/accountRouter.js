const express = require("express");
const router = express.Router();
const accountController = require("./../Controllers/accountController");
const isAuth = require("./../middelWare/auth");

router.get("/me", isAuth, accountController.getProfile); // User get profile
router.post("/update", isAuth, accountController.updateProfile); // User Update profile
router.post("/change-password", isAuth, accountController.changePassword); // User Update profile
router.delete("/", isAuth, accountController.deleteProfile); // User delete profile

module.exports = router;
