const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SourceSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    jurisdiction: { type: Schema.Types.ObjectId, ref: "Jurisdiction", required: true },
    category: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
    description: { type: String, required: true },
    comments:  { type: String },
    externalUrl: { type: String, required: true },
});

// Virtual Prop for the Interal URL
SourceSchema.virtual("url").get(function () {
    return `/source/${this._id}`;
});

// Export model
module.exports = mongoose.model("Source", SourceSchema);