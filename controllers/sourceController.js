const Source = require("../models/source");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

// Display list of all sources.
exports.source_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: source list");
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
