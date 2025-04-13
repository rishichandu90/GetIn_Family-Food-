const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const Dish = require('./models/Dish');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-website')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find().sort({ createdAt: -1 });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/dishes/:author', async (req, res) => {
  try {
    const dishes = await Dish.find({ author: req.params.author }).sort({ createdAt: -1 });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/dishes', async (req, res) => {
  try {
    const dish = new Dish(req.body);
    const savedDish = await dish.save();
    res.status(201).json(savedDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/dishes/:id', async (req, res) => {
  try {
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Food Website API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 