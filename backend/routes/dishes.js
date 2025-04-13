const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const multer = require('multer');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// GET all dishes
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find().sort({ createdAt: -1 });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET dishes by category
router.get('/category/:category', async (req, res) => {
  try {
    const dishes = await Dish.find({ category: req.params.category });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new dish
router.post('/', upload.single('image'), async (req, res) => {
  const dish = new Dish({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    image: req.file ? req.file.path : req.body.image
  });

  try {
    const newDish = await dish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update dish
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    dish.name = req.body.name || dish.name;
    dish.description = req.body.description || dish.description;
    dish.category = req.body.category || dish.category;
    dish.price = req.body.price || dish.price;
    if (req.file) {
      dish.image = req.file.path;
    } else if (req.body.image) {
      dish.image = req.body.image;
    }

    const updatedDish = await dish.save();
    res.json(updatedDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE dish
router.delete('/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    await dish.deleteOne();
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 