const router = require("express").Router();
const Order = require("../models/order");
//const verifyToken = require("../middelwares/verify-token");
const Product = require('../models/product');

router.get('/highest-selling-product', async (req, res) => {
  try {
    // Group the orders by productID and calculate the total sales for each product
    const result = await Order.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productID',
          sales: { $sum: 1 }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 5 } // Fetch the top 5 highest-selling products
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    const highestSellingProducts = [];
    for (const product of result) {
      const productDetails = await Product.findById(product._id);
      if (productDetails) {
        highestSellingProducts.push({
          productID: product._id,
          sales: product.sales,
          product: productDetails
        });
      }
    }

    res.json({ highestSellingProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get("/orders", async (req, res) => {
  try {
    let products = await Order.find()
      .deepPopulate(" products.productID.owner")
      .exec();
    res.json({
      success: true,
      products: products
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: err.messaage
    });
  }
});
router.put("/order/:orderId/update-status", async (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
});





module.exports = router;