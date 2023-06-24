const router = require("express").Router();
const Image = require("../models/image");
const multer = require('multer');

const path = require('path');
// Connect to MongoDB


// Create a Mongoose schema for image documents

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// Define an API endpoint to upload an image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const image = new Image({
    filename: req.file.filename,
    path: req.file.path
  });

  image.save()
    .then(() => {
      res.status(201).json({ success: true, message: 'Image uploaded successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to upload image' });
    });
});

// Define an API endpoint to fetch the image details
router.get('/images', (req, res) => {
  Image.find()
    .then(images => {
      res.json(images);
    })
    .catch(error => {
      res.status(500).send('Error retrieving images');
    });
});
