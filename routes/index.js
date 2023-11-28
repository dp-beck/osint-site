const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

// Require controller modules.
const jurisdiction_controller = require("../controllers/jurisdictionController");
const source_controller = require("../controllers/sourceController");
const category_controller = require("../controllers/categoryController");
const user_controller = require("../controllers/userController.js");

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
  
/// SOURCE ROUTES ///

/* GET home page. */
router.get('/', source_controller.index);

// GET request for creating a new user
router.get("/sign-up", user_controller.user_create_get);

// POST request for creating a new user
router.post("/sign-up", user_controller.user_create_post);

// GET request for logging in a user
router.get("/log-in", user_controller.user_log_in_get);

// POST request for logging in a user
router.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in"
    })
);

// GET request for logging out a user 
router.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        res.redirect("/");
    });
});

// GET request for creating a source. NOTE This must come before routes that display source (uses id).
router.get("/source/create", source_controller.source_create_get);

// POST request for creating source.
router.post("/source/create", source_controller.source_create_post);

// GET request to delete source.
router.get("/source/:id/delete", source_controller.source_delete_get);

// POST request to delete source.
router.post("/source/:id/delete", source_controller.source_delete_post);

// GET request to update source.
router.get("/source/:id/update", source_controller.source_update_get);

// POST request to update source.
router.post("/source/:id/update", source_controller.source_update_post);

// GET request for one source.
router.get("/source/:id", source_controller.source_detail);

// GET request for list of all source items.
router.get("/sources", source_controller.source_list);

/// JURISDICTION ROUTES ///

// GET request for creating jurisdiction. NOTE This must come before route for id (i.e. display jurisdiction).
router.get("/jurisdiction/create", jurisdiction_controller.jurisdiction_create_get);

// POST request for creating jurisdiction.
router.post("/jurisdiction/create", jurisdiction_controller.jurisdiction_create_post);

// GET request to delete jurisdiction.
router.get("/jurisdiction/:id/delete", jurisdiction_controller.jurisdiction_delete_get);

// POST request to delete jurisdiction.
router.post("/jurisdiction/:id/delete", jurisdiction_controller.jurisdiction_delete_post);

// GET request to update jurisdiction.
router.get("/jurisdiction/:id/update", jurisdiction_controller.jurisdiction_update_get);

// POST request to update jurisdiction.
router.post("/jurisdiction/:id/update", jurisdiction_controller.jurisdiction_update_post);

// GET request for one jurisdiction.
router.get("/jurisdiction/:id", jurisdiction_controller.jurisdiction_detail);

// GET request for list of all jurisdictions.
router.get("/jurisdictions", jurisdiction_controller.jurisdiction_list);

/// CATEGORY ROUTES ///

// GET request for creating a category. NOTE This must come before route that displays category (uses id).
router.get("/category/create", category_controller.category_create_get);

//POST request for creating category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all category.
router.get("/categories", category_controller.category_list);

module.exports = router;
