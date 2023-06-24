const router = require("express").Router();
const Address = require("../models/address");
const User = require("../models/user");
const verifyToken = require("../middelwares/verify-token");
const axios = require("axios");

// GET all addresses
router.get("/addresses", verifyToken, async (req, res) => {
  try {
    let addresses = await Address.find({
      user: req.decoded._id
    });

    res.json({
      success: true,
      addresses: addresses
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// GET list of countries
router.get("/countries", async (req, res) => {
  try {
    let response = await axios.get("https://restcountries.com/v3.1/all");

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// GET single address
router.get("/addresses/:id", verifyToken, async (req, res) => {
  try {
    let address = await Address.findOne({
      _id: req.params.id
    });

    res.json({
      success: true,
      address: address
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
router.get("/addresse/:id", async (req, res) => {
  try {
    let address = await Address.findOne({
      _id: req.params.id
    });

    res.json({
      success: true,
      address: address
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// POST create an address
router.post("/addresses", verifyToken, async (req, res) => {
  try {
    let address = new Address();
    address.user = req.decoded._id;
    address.country = req.body.country;
    address.fullName = req.body.fullName;
    address.streetAddress = req.body.streetAddress;
    address.city = req.body.city;
    address.state = req.body.state;
    address.zipCode = req.body.zipCode;
    address.phoneNumber = req.body.phoneNumber;
    address.deliverInstructions = req.body.deliverInstructions;
    address.securityCode = req.body.securityCode;

    await address.save();
    res.json({
      success: true,
      message: "Successfully added an address"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// PUT update an address
router.put("/addresses/:id", verifyToken, async (req, res) => {
  try {
    let foundAddress = await Address.findOne({
      user: req.decoded._id,
      _id: req.params.id
    });
    if (foundAddress) {
      if (req.body.country) foundAddress.country = req.body.country;
      if (req.body.fullName) foundAddress.fullName = req.body.fullName;
      if (req.body.streetAddress)
        foundAddress.streetAddress = req.body.streetAddress;
      if (req.body.city) foundAddress.city = req.body.city;
      if (req.body.state) foundAddress.state = req.body.state;
      if (req.body.zipCode) foundAddress.zipCode = req.body.zipCode;
      if (req.body.phoneNumber) foundAddress.phoneNumber = req.body.phoneNumber;
      if (req.body.deliverInstructions)
        foundAddress.deliverInstructions = req.body.deliverInstructions;
      if (req.body.securityCode)
        foundAddress.securityCode = req.body.securityCode;

      await foundAddress.save();

      res.json({
        success: true,
        message: "Succesfully updated the address"
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// DELETE delete an address
router.delete("/addresses/:id", verifyToken, async (req, res) => {
  try {
    let deletedAddress = await Address.remove({
      user: req.decoded._id,
      _id: req.params.id
    });

    if (deletedAddress) {
      res.json({
        success: true,
        message: "Address has been deleted"
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
router.get(`/address`, async (req, res) => {
  try {
    let addresses = await Address.find();

    res.json({
      status: true,
      addresses: addresses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// PUT set default
router.put("/addresses/set/default", verifyToken, async (req, res) => {
  try {
    const updatedAddressUser = await User.findOneAndUpdate({
      _id: req.decoded._id
    }, {
      $set: {
        address: req.body.id
      }

    });

     console.log(updatedAddressUser)
    if (updatedAddressUser) {
      res.json({
        success: true,
        message: "Successfully set this address as default"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
module.exports = router;