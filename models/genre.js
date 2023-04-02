// import mongoose
const mongoose = require('mongoose');

// Schema shorthand
const Schema = mongoose.Schema;

// define Schema
const GenreSchema = Schema({
    name: {type: String, requird: true, minLength: 3, maxLength: 100}
})

// define virtual
GenreSchema.virtual("url").get(function() {
    return `/catalog/genre/${this._id}`;
})

// export the module
module.exports = mongoose.model("Genre", GenreSchema);