const express = require('express');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/taskRoutes.js');
const authRoutes = require('./routes/authRoutes');
const { PORT } = require('./config/dotenv');
const swaggerSetup = require('./swagger'); 
const app = express();
swaggerSetup(app); 

app.use(bodyParser.json());

//  task and auth routes
app.use('/auth', authRoutes);
app.use('/api', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = app; // Exporting app for testing
