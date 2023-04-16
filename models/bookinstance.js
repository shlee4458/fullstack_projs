// import luxon
const { DateTime } = require("luxon");

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

// define virtual property for due back formatting
BookInstanceSchema.virtual("due_back_formatted").get(function() {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED)
}) 

// export model
module.exports = mongoose.model("BookInstance", BookInstanceSchema);

