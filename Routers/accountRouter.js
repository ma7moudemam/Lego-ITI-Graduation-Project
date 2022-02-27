const express = require("express");
const router = express.Router();
const accountController = require("./../Controllers/accountController");
const isAuth = require("./../middelWare/auth");

router.post("/", accountController.postUser); // Redirect
// router.post('/login', accountController.userLogin) // Just to generate token (useless)
router.get("/", accountController.getAllUsers); // Admin get all users profile
router.get("/me", isAuth, accountController.getProfile); // User get profile
router.patch("/", isAuth, accountController.updateProfile); // User Update profile
router.delete("/", isAuth, accountController.deleteProfile); // User Update profile

module.exports = router;
