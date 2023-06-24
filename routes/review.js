const router = require("express").Router();
const Review = require("../models/review");
const Product = require("../models/product");
const verifyToken = require("../middelwares/verify-token");


// POST review
router.post("/reviews/:productID", [verifyToken], async (req, res) => {
  try {
    const review = new Review();
    review.headline = req.body.headline;
    review.body = req.body.body;
    review.rating = req.body.rating;
    review.user = req.decoded._id;
    review.productID = req.params.productID;

    const product = await Product.findById(req.params.productID);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.reviews.push(review._id);
    await product.save();

    const savedReview = await review.save();
    if (savedReview) {
      return res.json({
        success: true,
        message: "Successfully added review"
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


// GET single review
router.get("/reviews/:productID", async (req, res) => {
  try {
    const productReviews = await Review.find({
        productID: req.params.productID
      })
      .populate("user")
      .exec();

    res.json({
      success: true,
      reviews: productReviews
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
router.get("/reviews", async (req, res) => {
  try {
    const allReviews = await Review.find()
      .populate("user")
      .exec();

    res.json({
      success: true,
      reviews: allReviews
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;