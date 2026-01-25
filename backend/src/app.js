const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require("./routes/adminRoutes");



app.use(cors()); 
app.get('/', (req, res) => {
    res.send('K-Gigs Backend API is running ');
  });
app.use(express.json());


app.use('/api/auth', authRoutes);

app.use("/api/admin", adminRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

module.exports = app;
