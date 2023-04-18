const Book = require("../models/book");
const Genre = require("../models/genre");

const async = require("async");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Genre.
exports.genre_list = (req, res, next) => {
  Genre.find()
    .sort({name: 1})
    .exec(function(err, list_genre) {
      if (err) {
        return next(err)
      }
      // if successful, render
      res.render("genre_list", {
        title: "Genre List",
        genre_list: list_genre
      })
    })
};

// Display detail page for a specific Genre.
// find the genre with the given genre id
// find all the books with that specific genre
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback)
      },
      genre_books(callback) {
        Book.find({genre: req.params.id}).exec(callback)
      }
    },

    (err, results) => {
      if (err) {
        return next(err)
      }

      if (results.genre == null) {
        // no result was found (the request genre id user has provided is not valid)
        const err = Error("Genre not found!")
        err.status = 404;
        return next(err)
      }
      // successful, so render
      res.render("genre_detail", {
        title: "Genre Detail",
        genre: results.genre,
        genre_books: results.genre_books
      })
    }
  )
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => { 
  // unlike get list and details, for showing default form, we don't need asynchandler
  res.render("genre_form", {
    title: "Create Genre"
  })
};

// Handle Genre create on POST.
exports.genre_create_post = [ // use array of middleware function
  // Middleware 1: validate and sanitize the name field
  body('name', 'Genre name must contain at least 3 characters')
    .trim() // sanitization: remove whitespace at start and end
    .isLength({ min : 3 }) // validation: check the resulting string isn't empty
    .escape(), // sanitization: remove HTML characters

  // Middleware 2: Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // runs the validation, making errors available in the form of validation result object
    const errors = validationResult(req);

    // create a genre object with escaped and trimmed data
    const genre = new Genre({ name: req.body.name })

    if (!errors.isEmpty()) {

      // there are errors. Render the forms with sanitized values/error message
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array() // turn the errors into array
      })
      return;
    } else {
      // Data from form is valid
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({ name: req.body.name }).exec();

      if (genreExists) {
        res.redirect(genreExists.url);
      } else {
        await genre.save(); // New genre saved. Redirect to the new genre page
        res.redirect(genre.url);
      }
    }
  })
];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, allBooksByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(), // find specific genre
    Book.find({genre: req.params.id}, "title summary").exec() // find all books of the genre
  ])

  if (genre === null) {
    res.redirect("/catalog/genres")
  }

  res.render("genre_delete", {
    title: "Delete Genre",
    genre: genre,
    books: allBooksByGenre
  })
})

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, allBooksByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(), // find specific genre
    Book.find({genre: req.params.id}, "title summary").exec() // find all books of the genre
  ])

  if (allBooksByGenre.length > 0) {
    res.render("genre_delete", {
      title: "Delete Genre",
      genre: genre,
      books: allBooksByGenre
    })
    return;
  } else {
    await Genre.findByIdAndDelete(req.params.id);
    res.redirect("/catalog/genres")
  }
})

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
};