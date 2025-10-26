const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("failure", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are Logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

//logout user
// Route to log the user out
router.get("/logout", (req, res) => {
  // Call Passport's logout function to end the user's session
  req.logout((err) => {
    // If there is an error while logging out, pass it to the next error handler
    if (err) {
      return next(err); // 'return' stops further code here and sends the error to Express's next middleware
    }
    // If logout is successful, show a success message using flash
    req.flash("success", "You are logged out!");
    // Redirect the user back to the listings page after logging out
    res.redirect("/login");
  });
});
module.exports = router;
