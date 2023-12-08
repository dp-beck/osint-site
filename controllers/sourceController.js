const Source = require("../models/source");
const Jurisdiction = require("../models/jurisdiction");
const Category = require("../models/category");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Controller for Home Page
exports.index = asyncHandler(async (req, res, next) => {
  const [
    numSources,
    numJurisdictions,
    numCategories
  ] = await Promise.all([
    Source.countDocuments({}).exec(),
    Jurisdiction.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Open-Source Compendium",
    source_count: numSources,
    jurisdiction_count: numJurisdictions,
    category_count: numCategories,
    user: req.user,
  });
});

// Display list of all sources.
exports.source_list = asyncHandler(async (req, res, next) => {
  const allSources = await Source.find({}, "name jurisdiction")
    .sort({ name: 1 })
    .populate("jurisdiction")
    .exec();
  
    res.render("source_list", { title: "Source List", source_list: allSources, user: req.user});
});

// Display detail page for a specific source.
exports.source_detail = asyncHandler(async (req, res, next) => {
  const source = await Source.findById(req.params.id)
    .populate("jurisdiction")
    .populate("category")
    .exec();
  
  if (source === null) {
    const err = new Error("Source not found.");
    err.status = 404;
    return next(err);
  }

  res.render("source_detail", {
    title: source.name,
    source: source,  
    user: req.user
  });

});

// Display source create form on GET.
exports.source_create_get = asyncHandler(async (req, res, next) => {
  const [allJurisdictions, allCategories ] = await Promise.all([
    Jurisdiction.find().sort( {name: 1}).exec(),
    Category.find().sort({ name: 1 }).exec()
  ]);
  res.render("source_form", {
    title: "Create Source",
    jurisdictions: allJurisdictions,
    categories: allCategories,
    user: req.user,
  });
});

// Handle source create on POST.
exports.source_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  body("name", "Name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("jurisdiction", "Jurisdiction must not be empty.")
    .trim()
    .isLength({ min:1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min:1 })
    .escape(),
  body("externalUrl", "External URL must not be empty.")
    .trim()
    .isLength({ min:1 }),
  body("category.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const source = new Source({
      name: req.body.name,
      jurisdiction: req.body.jurisdiction,
      description: req.body.description,
      externalUrl: req.body.externalUrl,
      category: req.body.category
    });

    if (!errors.isEmpty()) {
      const [allJurisdictions, allCategories ] = await Promise.all([
        Jurisdiction.find().sort( {name: 1}).exec(),
        Category.find().sort({ name: 1 }).exec()
      ]);

      for (const category of allCategories) {
        if (source.category.includes(category._id)) {
          category.checked = "true";
        }
      }
      res.render("source_form", {
        title: "Create Source",
        jurisdictions: allJurisdictions,
        categories: allCategories,
        source: source,
        errors: errors.array(),
        user: req.user,
      });
    } else {
      await source.save();
      res.redirect(source.url);
    }
  }),
];

// Display source delete form on GET.
exports.source_delete_get = asyncHandler(async (req, res, next) => {
  const source = await Source.findById(req.params.id).exec();

  if (source === null) {
    res.redirect("/sources");
  };

  res.render("source_delete", {
    title: "Delete Source",
    source: source,
    user: req.user
  });
});

// Handle source delete on POST.
exports.source_delete_post = asyncHandler(async (req, res, next) => {
  const source = await Source.findById(req.params.id).exec();
  await Source.findByIdAndDelete(req.body.sourceid);
  res.redirect("/sources");
});

// Display source update form on GET.
exports.source_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: source update GET");
});

// Handle source update on POST.
exports.source_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: source update POST");
});
