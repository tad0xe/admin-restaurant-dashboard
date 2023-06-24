const Owner = require('../models/owner');
const express = require('express');

const router = express.Router();


router.post(`/owners`, async (req, res) =>{
   try {
    let owner = new Owner();
        owner.name= req.body.name;
        owner.about= req.body.about;

       
    await owner.save();
    res.json({
        status: true,
        message:"save succes"
    })
   } catch (error) {
    res.status(500).json({success: false, message:err.message})
   }


})
router.get(`/owners`, async (req, res) =>{
    try {
    let owners = await Owner.find();

    res.json({
        status: true,
        owners: owners
    })
   } catch (error) {
    res.status(500).json({success: false, message:error.message})
   }
   
   
})



module.exports =router;