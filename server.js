// Import necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Import routes
const authRoutes = require('./routes/auth');
const scrapeRoutes = require('./routes/scrape');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/scrape', scrapeRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});