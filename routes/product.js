const Product = require("../models/product");
const express = require("express");

const upload = require("../middelwares/upload-photo");
const router = express.Router();
router.post("/upload", upload.array("photos", 3), function(req, res, next) {
  res.send({
    data: req.files,
    msg: "Successfully uploaded " + req.files.length + " files!"
  });
});
router.post(`/products`, upload.array("photos" , 10),  async (req, res) => {
 // console.log(res);
  try {
    let product = new Product();
   // product.photos.push(req.files[10].location);
  // req.files.forEach(f => product.photos.push(f.location))
    product.photos.push(...req.files.map(({ location }) => location));
  // product.category = req.body.categoryID;
    product.title = req.body.title;
    product.brand = req.body.brand;
   // product.size = req.body.size;
    product.description = req.body.description;
   // product.photos = req.files[0].location;
    product.availability = req.body.availability
    product.price = req.body.price;
    product.stockQuantity = req.body.stockQuantity;

    await product.save();
    console.log(Product);
    res.json({
      status: true,
      message: "save succes",
      data: req.files,
      msg: "Successfully uploaded " + req.files.length + " files!"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

router.get(`/products`, async (req, res) => {
  let filter = {};
  try {

    let products = await Product.find(filter)
      .populate("category")
      .exec();

    res.json({
      status: true,
      products: products
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false });
  }
});
router.get(`/products/:id`, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ _id: productId }).populate("reviews").exec();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const overallRating = await product.calculateOverallRating();
    product.overallRating = overallRating;
    await product.save();

    res.json({
      status: true,
      product: product,
      overallRating: overallRating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



// POST /products/:id/views - Update product views
router.post('/products/:id/views', async (req, res) => {

  try {
    const productId = req.params.id;

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment the views count
    product.views += 1;

    // Save the updated product
    await product.save();

    res.status(200).json({ message: 'Product views updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// POST request to increment the likes of a product
router.post('/products/:id/like', async (req, res) => {

  const productId = req.params.id;
  console.log(productId)

  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ likes: product.likes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

// GET request to retrieve the total likes of a product
router.get('/products/:productId/likes', async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    res.json({ likes: product.likes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve likes' });
  }
});
router.put(`/products/:id`, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          price: req.body.price,
          description: req.body.description,
          photo: req.body.photo,
          stockQuantity: req.body.stockQuantity,
          category: req.body.categoryID,
          owner: req.body.ownerID,
          type: req.body.type,
          brand: req.body.brand,
          size: req.body.size
        }
      },
      {
        upsert: true
      }
    );

    res.json({
      status: true,
      updatedProduct: product
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.delete(`/products/:id`, async (req, res) => {
  try {
    let deletedProduct = await Product.findByIdAndDelete({
      _id: req.params.id
    });
    if (deletedProduct) {
      res.json({
        status: true,
        message: "sucess"
      });
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
