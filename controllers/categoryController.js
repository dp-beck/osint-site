const Category = require("../models/category");
const Source = require("../models/source");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all category.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
    user: req.user,
  });
});

// Display detail page for a specific category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, sourcesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Source.find({ category: req.params.id }, "name description"),
  ]);
  if (category === null ) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_sources: sourcesInCategory,
    user: req.user
  });
});

// Display category create form on GET.
exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category", user: req.user });
};

// Handle category create on POST.
exports.category_create_post = [
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({ name: req.body.name });

    if(!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        user: req.user,
        errors: errors.array()
      });
      return;
    } else {
      const categoryExists = await Category.findOne({ name: req.body.name }).exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

// Display category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, sourcesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Source.find({ category: req.params.id }, "name description"),
  ]);

  if (category === null) {
    res.redirect('/categories');
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_sources: sourcesInCategory,
    user: req.user,
  });
});

// Handle category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, sourcesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Source.find({ category: req.params.id }, "name description"),
  ]);

  if (sourcesInCategory.length > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_sources: sourcesInCategory,
      user: req.user,
    });
    return;
  } else {
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect('/categories');
  }
});

// Display category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update GET");
});

// Handle category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update POST");
});
