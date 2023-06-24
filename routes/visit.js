const Visit = require("../models/visit");
const express = require("express");
const router = express.Router();

router.post(`/visit`, async (req, res) => {
  try {

    let visit = new Visit();
    visit.ipAddress = req.body.ipAddress;
    visit.userAgent = req.body.userAgent;
    visit.url = req.body.url;
    visit.count = req.body.count


    await visit.save();
    console.log(Visit)
    res.json({
      status: true,
      message: "save succes"
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
    });
  }
});
router.get(`/vit`, async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate()
      .exec();

    res.json({
      status: true,
      visits: visits
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.get('/visits', async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const visits = await Visit.find({ time: { $gte: new Date(today), $lt: new Date(today + 'T23:59:59.999Z') } }).exec();

    const count = visits.reduce((acc, visit) => acc + visit.count, 0);

    res.json({
      status: true,
      count: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve daily counts',
      error: error.message,
    });
  }
});



router.get(`/visit`, async (req, res) => {
  try {

    const visits = await Visit.countDocuments()
      .populate()
      .exec();

    res.json({
      status: true,
      visits: visits
    });
  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});




router.put(`/visit/:id`, async (req, res) => {
  try {
    const visit = await Visit.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        photo: req.body.photo,
        stockQuantity: req.body.stockQuantity,
        category: req.body.categoryID,
        owner: req.body.ownerID
      }
    }, {
      upsert: true
    });

    res.json({
      status: true,
      updatedProduct: visit
    });
  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});

router.delete(`/visit/:id`, async (req, res) => {
  try {
    let deletedProduct = await Visit.findByIdAndDelete({
      _id: req.params.id
    });
    if (deletedProduct) {
      res.json({
        status: true,
        message: "sucess"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});
module.exports = router;