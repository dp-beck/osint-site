const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true },
    password: {type: String, required: true },
    firstName: {type: String, required: true},
    lastName: {type: String},
    creatorPrivilege: {type:Boolean, required: true}
});

// Virtual Prop for the Internal URL
UserSchema.virtual("url").get(function () {
    return `/users/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);