const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseAlgolia= require('mongoose-algolia')
const ProductSchema = new Schema(
  {
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    title: String,
    description: String,
    size: { type: Array },
    brand: String,
    tag: { type: Array },
    photos: { type: Array },
    time: { type: Date, default: Date.now },
    price: Number,

    availability: {
      type: Boolean,
      default: false,
    },
    stockQuantity: Number,
    rating: Number,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    overallRating: { type: Number, default: 0 },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

ProductSchema.methods.calculateOverallRating = async function() {
  const reviews = this.reviews;
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  } else {
    return 0;
  }
};
ProductSchema.plugin(mongooseAlgolia, {
  appId: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_SECRET,
  indexName: process.env.ALGOLIA_INDEX,
  selector: "title _id photo description price rating overallRating owner",
  populate: {
    path: "reviews"
  },
  debug: true
});

let Model = mongoose.model("Product", ProductSchema);
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
  searchableAttributes: ["title"]
});
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
