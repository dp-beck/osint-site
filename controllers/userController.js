const User = require("../models/user");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

// Display user create form on GET.
exports.user_create_get = (req, res, next) => {
    res.render("sign-up", { title: "Sign Up"});
  };

// Hander user create on POST
exports.user_create_post = [
  //Validate and sanitize the username field.
  body("username", "Username must contain at least 5 characters")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
        username: req.body.username,
        password: req.body.password,
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
  })];
