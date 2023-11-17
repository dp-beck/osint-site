const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const JurisdictionSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    subjurisdictions: [{ type: Schema.Types.ObjectId, ref: "Jurisdiction" }],
    sources: { type: Schema.Types.ObjectId, ref: "Source" },
    externalUrl: { type: String, required: true },
});

// Virtual Prop for the Internal URL
JurisdictionSchema.virtual("url").get(function () {
    return `/jurisdiction/${this._id}`;
});

// Export model
module.exports = mongoose.model("Jurisdiction", JurisdictionSchema);