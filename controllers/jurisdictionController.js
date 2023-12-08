const Jurisdiction = require("../models/jurisdiction");
const Source = require("../models/source");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Jurisdictions
exports.jurisdiction_list = asyncHandler(async (req, res, next) => {
    // Display list of all Jurisdictions.
  const allJurisdictions = await Jurisdiction.find().sort({ name: 1 }).exec();
  res.render("jurisdiction_list", {
    title: "Jurisdiction List",
    jurisdiction_list: allJurisdictions,
    user: req.user
  });
});

// Display detail page for a specific Jurisdiction.
exports.jurisdiction_detail = asyncHandler(async (req, res, next) => {
    const [jurisdiction, allSourcesInJurisdiction] = await Promise.all([
      Jurisdiction.findById(req.params.id)
        .populate("subjurisdictions")
        .exec(),
      Source.find({ jurisdiction: req.params.id }, "name description").exec(),
    ]);

    if (jurisdiction === null) {
      const err = new Error("Jurisdiction not found");
      err.status = 404;
      return next(err);
    }

    res.render("jurisdiction_detail", {
      title: "Jurisdiction Detail",
      jurisdiction: jurisdiction,
      subjurisdictions: jurisdiction.subjurisdictions,
      jurisdiction_sources: allSourcesInJurisdiction,
      user: req.user
    });
});

// Display jurisdiction create form on GET.
exports.jurisdiction_create_get = asyncHandler(async (req, res, next) => {
  const allJurisdictions = await Jurisdiction.find().sort({name:1}).exec();
  res.render("jurisdiction_form", {
    title: "Create Jurisdiction",
    subjurisdictions: allJurisdictions, 
    user: req.user });
  });

// Handle jurisdiction create on POST.
exports.jurisdiction_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.subjurisdictions)) {
      req.body.subjurisdictions =
        typeof req.body.subjurisdictions === "undefined" ? [] : [req.body.subjurisdictions];
    }
    next();
  },

  body("name")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Name must be at least three characters."),
  body("subjurisdictions.*").escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const jurisdiction = new Jurisdiction({
      name: req.body.name,
      subjurisdictions: req.body.subjurisdictions,
    });

    if (!errors.isEmpty()) {
      const allJurisdictions = await Jurisdiction.find().sort({name:1}).exec();

      for (const subjurisdiction of allJurisdictions) {
        if (jurisdiction.subjurisdictions.includes(subjurisdiction._id)) {
          subjurisdiction.checked = "true";
        }
      }

      res.render("jurisdiction_form", {
        title: "Create Jurisdiction",
        jurisdiction: jurisdiction,
        subjurisdictions: allJurisdictions, 
        user: req.user,
        errors: errors.array(),
      });
      return;
    } else {
      await jurisdiction.save();
      res.redirect(jurisdiction.url);
    }
  }),
];

// Display jurisdiction delete form on GET.
exports.jurisdiction_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: jurisdiction delete GET");
  });
  
  // Handle jurisdiction delete on POST.
  exports.jurisdiction_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: jurisdiction delete POST");
  });
  
  // Display jurisdiction update form on GET.
  exports.jurisdiction_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: jurisdiction update GET");
  });
  
  // Handle jurisdiction update on POST.
  exports.jurisdiction_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: jurisdiction update POST");
  });