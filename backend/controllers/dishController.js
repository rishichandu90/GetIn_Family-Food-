const Dish = require('../models/Dish');

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find().sort({ createdAt: -1 });
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dishes', error: error.message });
  }
};

// Get dishes by category
exports.getDishesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const dishes = await Dish.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dishes by category', error: error.message });
  }
};

// Create a new dish
exports.createDish = async (req, res) => {
  try {
    const newDish = new Dish(req.body);
    const savedDish = await newDish.save();
    res.status(201).json(savedDish);
  } catch (error) {
    res.status(400).json({ message: 'Error creating dish', error: error.message });
  }
};

// Update a dish
exports.updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDish = await Dish.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.status(200).json(updatedDish);
  } catch (error) {
    res.status(400).json({ message: 'Error updating dish', error: error.message });
  }
};

// Delete a dish
exports.deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDish = await Dish.findByIdAndDelete(id);
    
    if (!deletedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting dish', error: error.message });
  }
};

// Get a single dish by ID
exports.getDishById = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findById(id);
    
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.status(200).json(dish);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching dish', error: error.message });
  }
}; 