const Author = require("../models/author");
const Book = require("../models/book")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

// Display list of all Authors.
exports.author_list = (req, res, next) => {
  Author.find()
    .sort({family_name: 1})
    .exec(function(err, list_authors) {
      if (err) {
        return next(err)
      }
      // if successful, render
      res.render("author_list", {
        title: "Author_list",
        author_list: list_authors
      })
    })
};

// Display detail page for a specific Author.
exports.author_detail = asyncHandler(async (req, res, next) => {
  // get details of authors and all books
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec()
  ]);

  if (author == null) {
    // if author was not found
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("author_detail", {
    title: "Author Detail",
    author: author,
    author_books: allBooksByAuthor
  })
}) 


// Display Author create form on GET.
exports.author_create_get = (req, res, next) => {
  res.render("author_form", { title: "Create Author" });
}

// Handle Author create on POST.
exports.author_create_post = [
  // Middleware 1: Validate and sanitize fields
  body("first_name")
    .trim() // sanitize 1
    .isLength({ min: 1 })
    .escape() // sanitize 2
    .withMessage("First name must be specified.") // if not provided
    .isAlphanumeric() // Validate: if it is alphanumeric
    .withMessage("First name has non-alphanumeric characters."), // if not alphanumeric

  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),

  body("date_of_birth", "Invalid date of birth")
    .optional( { checkFalsy: true})
    .isISO8601()
    .toDate(),
 
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true }) // below is not executed if the value is falsy
    .isISO8601()
    .toDate(),
    
  // Middleware 2: Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {

    // Extract request after validation and sanitization
    const errors = validationResult(req)

    // Create Author object with escaped and trimmed data
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death
    });

    // case 1: data from the form is not valid
    if (!errors.isEmpty()) {
    // There are errors. Render form again with sanitized values/erors messages
      res.render("author_form", {
        title: "Create Author",
        author: author,
        errors: errors.array()
      });
      return;
    } else {
      // case 2: data from form is valid
      await author.save()
      
      // redirect to the new author record
      res.render()

    }
  })
]

// Display Author delete form on GET.
exports.author_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
};

// Handle Author delete on POST.
exports.author_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
};

// Display Author update form on GET.
exports.author_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
exports.author_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};