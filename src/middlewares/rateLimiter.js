const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

// Set up trust proxy to trust the proxy headers
app.set('trust proxy', true);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000,
  skipSuccessfulRequests: true,
  // message: 'Too many requests, please try again later.',
});

module.exports = {
  authLimiter,
};
