const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');
const { PORT } = require('./config/dotenv');

const app = express();

app.use(bodyParser.json());

//  task and auth routes
app.use('/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = app; // Exporting app for testing
