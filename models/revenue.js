const mongoose = require("mongoose");

const Schema = mongoose.Schema;
//const mongooseAlgolia = require("mongoose-algolia");
const RevenueSchema = new Schema(
  {
    income: Number,
    expenses: Number,
    time: { type: Date, default: Date.now },
 //createdAt: { type: Date, expires: '5m', default: Date.now }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  },
  {
    timestamps: true
  }
);

const Revenue = mongoose.model("Revenue", RevenueSchema);
module.exports = Revenue;
