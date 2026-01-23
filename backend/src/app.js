const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');


// Middleware
app.use(cors()); 
app.get('/', (req, res) => {
    res.send('K-Gigs Backend API is running 🚀');
  });// allow frontend requests
app.use(express.json()); // parse JSON body

// Mount routes
app.use('/api/auth', authRoutes);


// Global error handling (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

module.exports = app;
