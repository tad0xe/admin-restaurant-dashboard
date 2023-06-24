const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    filename: String,
    path: String

});

const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;
