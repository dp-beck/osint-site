const Source = require("../models/source");
const Jurisdiction = require("../models/jurisdiction");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

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
    title: "OSINT Site Home",
    source_count: numSources,
    jurisdiction_count: numJurisdictions,
    category_count: numCategories,
  });
});

// Display list of all sources.
exports.source_list = asyncHandler(async (req, res, next) => {
  const allSources = await Source.find({}, "name jurisdiction")
    .sort({ name: 1 })
    .populate("jurisdiction")
    .exec();
  
    res.render("source_list", { title: "Source List", source_list: allSources});
});

// Display detail page for a specific source.
exports.source_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: source detail: ${req.params.id}`);
});

// Display source create form on GET.
exports.source_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: source create GET");
});

// Handle source create on POST.
exports.source_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: source create POST");
});

// Display source delete form on GET.
exports.source_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: source delete GET");
});

// Handle source delete on POST.
exports.source_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: source delete POST");
});

// Display source update form on GET.
exports.source_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: source update GET");
});

// Handle source update on POST.
exports.source_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: source update POST");
});
