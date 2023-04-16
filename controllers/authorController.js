const Author = require("../models/author");
const Book = require("../models/book")
const asyncHandler = require("express-async-handler")

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
exports.author_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create GET");
};

// Handle Author create on POST.
exports.author_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Author create POST");
};

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