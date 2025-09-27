const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { route } = require("./listings.js");
const { saveRedirectUrl } = require("../loggedIn-middileware.js");
const userController = require("../controllers/users.js")

router.get("/", (req, res) => {
    res.redirect("/login");
});

router.route("/signUp")
    .get(userController.userSignUpRenderForm)
    .post(wrapAsync(userController.signUp))


router.route("/login")
    .get(userController.userLoginRenderForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.login))

    
router.get("/logout", userController.logout);


module.exports = router;