const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');
const Item = require('../models/Item');

// Get Categories and Items
router.get('/dashboard', auth, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    const items = await Item.find({ category: { $in: categories.map(c => c._id) } });
    res.json({ categories, items });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create Category
router.post('/categories', auth, async (req, res) => {
  try {
    const newCategory = new Category({
      name: req.body.name,
      user: req.user.id
    });
    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Rename Category (NEW)
router.put('/categories/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (category.user.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    category.name = req.body.name;
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete Category
router.delete('/categories/:id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (category.user.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    await Item.deleteMany({ category: req.params.id }); // Delete items in category
    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add Item
router.post('/items', auth, async (req, res) => {
  try {
    const newItem = new Item({
      name: req.body.name,
      quantity: req.body.quantity,
      note: req.body.note,
      category: req.body.categoryId
    });
    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update Item (Toggle Bought, Edit)
router.put('/items/:id', auth, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    // Verify ownership via category 
    const category = await Category.findById(item.category);
    if (category.user.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    item = await Item.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete Item
router.delete('/items/:id', auth, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const category = await Category.findById(item.category);
    if (category.user.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
