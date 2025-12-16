const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// 1. Logger FIRST 
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

// 2. Body Parsers with explicit error handling
app.use(express.json({
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.error('JSON Parse Error:', e.message);
      res.status(400).send('Invalid JSON');
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(cors());

// 3. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data'));

// 4. Test Route
app.get('/test', (req, res) => {
  res.send('Server is working');
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

// 5. Global Error Handler
app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR HANDLER]', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

console.log('Starting Server...');
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Failed:');
    console.error(err);
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
