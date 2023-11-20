const Jurisdiction = require("../models/jurisdiction");
const asyncHandler = require("express-async-handler");

// Display list of all Jurisdictions
exports.jurisdiction_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Jurisdictions List");
});

// Display detail page for a specific Jurisdiction.
exports.jurisdiction_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Jurisdiction detail: ${req.params.id}`);
});

// Display jurisdiction create form on GET.
exports.jurisdiction_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Jurisdiction create GET");
});

// Handle jurisdiction create on POST.
exports.jurisdiction_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Jurisdiction create POST");
});

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