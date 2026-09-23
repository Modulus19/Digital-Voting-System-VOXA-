const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./Middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes will be mounted here later, e.g.
// app.use('/api/auth', require('./Routes/authRoutes'));

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;