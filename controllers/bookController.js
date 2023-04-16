// Include all the models 
const Book = require("../models/book");
const Author = require("../models/author");
const BookInstance = require("../models/bookinstance");
const Genre = require("../models/genre");
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')

// import async module
const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
        book_count(callback) {
            Book.countDocuments({}, callback) // pass an empty object as match condition to find all douments of this collection
        },
        book_instance_count(callback) {
            BookInstance.countDocuments({}, callback)
        },
        book_instance_available_count(callback) {
            BookInstance.countDocuments({status:"available"}, callback)
        },
        author_count(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count(callback) {
            Genre.countDocuments({}, callback);
        },
    }, 
    (err, results) => { // this is an optional callback that is executed after all the parallel callbacks are executed
                        // the callback is called with the same data type with the previous callback
                        // => meaning return value of the previous callbacks are passed into results
                        // => data: results will be accessible as {key: value} in the view 
        res.render('index', 
            { // at index page in the views, pass in the parameters
                title: "Local Library Home",
                error: err,
                data: results,
            }
        )
  })
}

// Display list of all books.
exports.book_list = (req, res, next) => {
  Book.find({},"title author") // find all the instances, select only title and author
    .sort({title : 1}) // sort ascending by title
    .populate("author") // join the author id to the author table
    .exec(function (err, list_books) { // takes the returned document of list of books to the function
      if (err) {
        return next(err);
      }

      // successful, render
      res.render("book_list", {title: "Book List", book_list: list_books}); // render takes that value
    })
};

// Display detail page for a specific book.
exports.book_detail = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book:req.params.id }).exec()
  ]);

  if (book == null) {
    // if there is no result
    const err = new Error("Book not found")
    err.status = 404;
    return next(err);
  }

  res.render("book_detail", {
    title: book.title,
    book: book,
    book_instances: bookInstances
  })
});

// Display book create form on GET.
exports.book_create_get = asyncHandler(async (req, res, next) => {
  // Get all the authors and genres, which we can use for adding to our book
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().exec(),
    Genre.find().exec()
  ]),

  res.render('book_form', {
    title: "Create Book",
    author: allAuthors,
    genres: allGenres
  })
})

// Handle book create on POST.
exports.book_create_post = [

  // converts genre to an array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
  },

  // validate and sanitize
  body('title', "Title must not be empty!")
    .trim()
    .isLength({ min: 1})
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(), // use wildcard to individually validate each of the genre array entries  

  // process after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation error from request
    const errors = validationResult(req);

    // Create a book object with escaped and trimmed data
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summar: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    })

    if (!errors.isEmpty()) {
      // If error exists
      
      // get all the authors and genres for form
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().exec(),
        Genre.find().exec()
      ])

      // Mark our selected genres as checked
      for (const genre of allGenres) {
        if (book.genre.indexOf(genre._id) > - 1) { // if the genre is in the genre array of newly created book
          genre.checked = 'true'
        }
      }
      
      res.render("book_form", {
        title: "Create Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),        
      });
    } else {
      await book.save()
      res.redirect(book.url)
    }
  })
]

// Display book delete form on GET.
exports.book_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST.
exports.book_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update POST");
};