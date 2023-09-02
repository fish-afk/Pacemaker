const express = require('express');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./authMiddleware');

const app = express();

// Add cookie parsing middleware
app.use(cookieParser());

// Apply the authMiddleware to specific routes that require authentication
app.get('/securing-the-route', authMiddleware, (req, res) => {
  // This route is protected and can access req.user
  res.json({ message: `Authenticated as ${req.user.username}` });
});

// Start your middleware.js app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
