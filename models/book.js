// import mongoose
const mongoose = require('mongoose');

// shorthand for Schema
const Schema = mongoose.Schema;

// define a Schema
const BookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    summary: { type: String, required: true },
    isbn: { type: String, required: true },
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],    
})

// define a virtual
BookSchema.virtual("url").get(function() {
    return `/catalog/book/${this._id}`;
})

// export the module
module.exports = mongoose.model("Book", BookSchema);