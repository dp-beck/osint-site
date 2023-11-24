const Jurisdiction = require("../models/jurisdiction");
const Source = require("../models/source");
const asyncHandler = require("express-async-handler");

// Display list of all Jurisdictions
exports.jurisdiction_list = asyncHandler(async (req, res, next) => {
    // Display list of all Jurisdictions.
  const allJurisdictions = await Jurisdiction.find().sort({ name: 1 }).exec();
  res.render("jurisdiction_list", {
    title: "Jurisdiction List",
    jurisdiction_list: allJurisdictions,
  });
});

// Display detail page for a specific Jurisdiction.
exports.jurisdiction_detail = asyncHandler(async (req, res, next) => {
    const [jurisdiction, allSourcesInJurisdiction] = await Promise.all([
      Jurisdiction.findById(req.params.id).exec(),
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
      jurisdiction_sources: allSourcesInJurisdiction
    });
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