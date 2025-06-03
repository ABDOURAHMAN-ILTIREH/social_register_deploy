const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration (fix origin and order)
app.use(cors({
    origin: process.env.FRONTEND_URL, // Frontend port (not 5000)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.static(path.join(__dirname, '../client/dist'), {
    etag: true, // Enable ETag for caching
    lastModified: true, // Use Last-Modified headers
    maxAge: '1d', // Cache for 1 day (adjust as needed)
}));

// Fallback to index.html for SPA (client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.options('*', cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});