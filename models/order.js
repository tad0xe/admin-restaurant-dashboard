const mongoose = require("mongoose");
const deepPopulate = require("mongoose-deep-populate")(mongoose);
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productID: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      totalPrice: Number
    }
  ],
  estimatedDelivery: String,

created_at: { type: Date, default: Date.now },
  status: { type: String, default: "new" } // Add the status field with default value "new"
});

OrderSchema.plugin(deepPopulate)

module.exports = mongoose.model("Order", OrderSchema);