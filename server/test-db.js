require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB Connection...');
console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('SUCCESS: MongoDB Connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR: Connection Failed');
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    if (err.reason) console.error('Reason:', err.reason);
    process.exit(1);
  });
