const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// Redirect
router.get("/github/callback", 
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/")
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/login"));
});

module.exports = router;
