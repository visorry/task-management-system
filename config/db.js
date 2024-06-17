const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vis:vishnu@cluster0.wcrafar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
