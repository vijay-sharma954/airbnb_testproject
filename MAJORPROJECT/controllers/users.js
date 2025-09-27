const User = require("../models/user");


module.exports.userSignUpRenderForm = (req, res) => {
    res.render("users/signUp");
}

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signUp");
    }
}


module.exports.userLoginRenderForm = (req, res) => {
    res.render("users/login");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirect = res.locals.redirectUrl || "/listings"
    res.redirect(redirect);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You have logged out");
        res.redirect("/listings");
    });
}