require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'access_token_secret'
};
