const Revenue = require("../models/revenue");
const express = require("express");
const router = express.Router();

router.post(`/revenue`,  async (req, res) => {
  console.log(res)
  try {

    let revenue = new Revenue();
    revenue.income = req.body.income;
    revenue.expenses = req.body.expenses;
    await revenue.save();
    console.log(Revenue)
    res.json({
      status: true,
      message: "save succes"
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, });
  }
});


router.get(`/revenue`, async (req, res) => {

  try {
    let revenues = await Revenue.find()
      .populate()
      .exec();

    res.json({
      status: true,
      revenues: revenues
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});


router.put(`/revenue/:id`, async (req, res) => {
  try {
    const revenue = await Revenue.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          price: req.body.price,
          description: req.body.description,
          photo: req.body.photo,
          stockQuantity: req.body.stockQuantity,
          category: req.body.categoryID,
          owner: req.body.ownerID
        }
      },
      {
        upsert: true
      }
    );

    res.json({
      status: true,
      updatedProduct: revenue
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.delete(`/revenue/:id`, async (req, res) => {
  try {
    let deletedProduct = await Revenue.findByIdAndDelete({
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
