const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcryptjs = require('bcryptjs');
const asyncHandler = require("express-async-handler");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/// PASSPORT HANDLER FUNCTIONS ///
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username "})
      };
      const match = await bcryptjs.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      };
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

/// USER RELATED CONTROLLER FUNCTIONS ///

// Display user create form on GET.
exports.user_create_get = (req, res, next) => {
    res.render("sign-up", { title: "Sign Up"});
  };

// Handle user create on POST
exports.user_create_post = [
  //Validate and sanitize the username field.
  body("username", "Username must contain at least 5 characters")
    .trim()
    .isLength({ min: 5 })
    .escape(),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .escape()
    .withMessage("Password must be 8 characters."),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    bcryptjs.hash(req.body.password, 10, async (err, hashedPassword) => {
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        creatorPrivilege: false,
      });
    
      if (!errors.isEmpty()) {
        res.render('sign-up', {
          title: "Sign Up",
          user: user,
          errors: errors.array(),
        });
        return;
      } else {
        const userExists = await User.findOne( {username: req.body.username})
          .collation({locale: "en", strength: 2 })
          .exec();
        if (userExists) {
          res.redirect(userExists.url);
        } else {
          await user.save();
        }
      }
      res.redirect("/");
    });
  })
];

// Display user log in form on GET.
exports.user_log_in_get = (req, res, next) => {
  res.render("log-in", { 
    title: "Log In",
    messages: req.session.messages,
   });
};

// Handle user log in POST
exports.user_log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureMessage: true,
});

// Handle user log out get
exports.user_log_out_get = (req, res, next) => {
  req.logout((err) => {
      if(err) {
          return next(err);
      }
      res.redirect("/");
  });
};

// Display detail page for a specific user.
exports.user_detail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  
  if (user === null) {
    const err = new Error("User not found.");
    err.status = 404;
    return next(err);
  }

  res.render("user_detail", {
    title: user.username,
    user: user,  
  });

});