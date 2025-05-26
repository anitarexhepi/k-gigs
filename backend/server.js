const express = require('express');
const cors = require('cors');
const gigsRoutes = require('./routes/gigs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/gigs', gigsRoutes);

console.log("Endpoint /api/gigs eshte inicializuar me sukses!");
app.listen(PORT, () => {
  console.log(`Serveri po funksionon ne http://localhost:${PORT}`);
});
