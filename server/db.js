require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

console.log('Connecting to MongoDB to check indexes...');
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected.');
    try {
      const indexes = await User.collection.indexes();
      console.log('Current Indexes:', indexes);

      const strays = ['clerkUserId_1', 'clerkId_1'];
      
      for (const idxName of strays) {
        if (indexes.find(idx => idx.name === idxName)) {
           console.log(`Found stray index "${idxName}". Dropping it...`);
           await User.collection.dropIndex(idxName);
           console.log(`Index "${idxName}" dropped.`);
        } else {
           console.log(`Index "${idxName}" not found.`);
        }
      }
      
    } catch (err) {
      console.error('Error managing indexes:', err);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => console.error(err));
