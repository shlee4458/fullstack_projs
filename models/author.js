// import luxon
const { DateTime } = require("luxon");

// import mongoose
// mongoose is the namespace of all the functions/classes that was exported from mongoose lib
const mongoose = require('mongoose'); 

// define Schema class shorthand
const Schema = mongoose.Schema; 

// create a author schema
const AuthorSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date}
})

// Virtual for full name
    // I want to add a property that can be called in individual document that get's user's fullname
AuthorSchema.virtual("name").get(function() {
    let fullname = ""

    if (this.first_name && this.family_name) {
        fullname = `${this.first_name}, ${this.family_name}`
    }
    
    if (!this.first_name || !this.family_name) {
        fullname = "";
    }
    return fullname;
})

// Virtual for url
AuthorSchema.virtual('url').get(function() {
    return `/catalog/author/${this._id}`;  // _id is the default auto generated id
})

AuthorSchema.virtual("date_of_birth_formatted").get(function() {
    return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
})

AuthorSchema.virtual("date_of_death_formatted").get(function() {
    return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : "";
})

// export model
module.exports = mongoose.model("Author", AuthorSchema);