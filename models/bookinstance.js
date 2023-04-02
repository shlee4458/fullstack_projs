// import mongoose
const mongoose = require('mongoose');

// shorthand for Schema
var Schema = mongoose.Schema;

// define a Schema
var BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

// define virtual property to the document
BookInstanceSchema.virtual("url").get(function() {
    return `/catalog/bookinstance/${this._id}`
})

// export model
module.exports = mongoose.model("BookInstance", BookInstanceSchema);