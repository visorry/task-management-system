const mongoose = require('mongoose');
require('dotenv').config();
const { MONGODB_URI } = require('./dotenv');

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
