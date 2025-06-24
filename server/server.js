const express = require("express");
require("dotenv").config();
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS (must come before other middleware)
app.use(cors({
  origin:  process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With','Cache-Control' ],
  maxAge: 86400
}));




// API Routes
app.use('/api', require('./router/authuserRoutes'));
app.use('/api', require('./router/usersRoutes'));
app.use('/api', require('./router/menagesRoutes'));
app.use('/api', require('./router/enqueterRoutes'));
app.use('/api', require('./router/logementRoutes'));
app.use('/api', require('./router/equipementRoutes'));
app.use('/api', require('./router/personnesRoutes'));
app.use('/api', require('./router/plainteRoutes'));
app.use('/api', require('./router/entretienRoutes'));

// In your Express server (for production)
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});