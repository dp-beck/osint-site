const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: { type: String, required: true, maxLength: 500 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true
});

// Virtual Prop for the Interal URL
CommentSchema.virtual("url").get(function () {
    return `/source/${this._id}`;
});

// Export model
module.exports = mongoose.model("Comment", CommentSchema);