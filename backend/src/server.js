const app = require('./app');
const { PORT } = require('./config/env');

app.use('/api/auth', require('./routes/auth.routes'));


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
