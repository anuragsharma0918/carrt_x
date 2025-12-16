require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Item = require('./models/Item');

const sampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // 1. Create Demo User
    const email = 'demo@example.com';
    let user = await User.findOne({ email });
    
    if (user) {
        console.log('Demo user already exists. resetting data for this user...');
        // Find categories by this user
        const categories = await Category.find({ user: user._id });
        const catIds = categories.map(c => c._id);
        
        // Delete items and categories
        await Item.deleteMany({ category: { $in: catIds } });
        await Category.deleteMany({ user: user._id });
        await User.findByIdAndDelete(user._id);
        console.log('Old demo data cleared.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    user = new User({
      username: 'Demo User',
      email,
      password: hashedPassword
    });
    await user.save();
    console.log('Demo User Created');

    // 2. Create Categories
    const groceries = await new Category({ name: 'Groceries', user: user._id }).save();
    const tech = await new Category({ name: 'Tech Wishlist', user: user._id }).save();
    const todo = await new Category({ name: 'Weekend To-Do', user: user._id }).save();
    
    console.log('Categories Created');

    // 3. Create Items
    const items = [
      { name: 'Almond Milk', quantity: '2 cartons', note: 'Unsweetened', category: groceries._id, isBought: false },
      { name: 'Avocados', quantity: '4', note: 'Ripe ones', category: groceries._id, isBought: true },
      { name: 'Whole Wheat Bread', quantity: '1', note: '', category: groceries._id, isBought: false },
      { name: 'RTX 5090', quantity: '1', note: 'Dream on', category: tech._id, isBought: false },
      { name: 'Mechanical Keyboard', quantity: '1', note: 'Keychron', category: tech._id, isBought: true },
      { name: 'Clean Garage', quantity: '1', note: '', category: todo._id, isBought: false },
    ];

    await Item.insertMany(items);
    console.log('Items Created');

    console.log('SEEDING COMPLETE!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

sampleData();
