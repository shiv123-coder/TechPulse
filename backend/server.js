const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable ETag HTTP caching
app.set('etag', 'strong');

// Lightweight request timing logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${req.method}] ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Health check (Fast 200 for Render / Uptime monitors)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'TechPulse Store API',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB'
  });
});

// Root
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'TechPulse E-Commerce API is running',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      products: {
        list: 'GET /api/products (filters: keyword, category, minPrice, maxPrice, sort)',
        categories: 'GET /api/products/categories',
        getSingle: 'GET /api/products/:id',
        create: 'POST /api/products (Admin only)',
        update: 'PUT /api/products/:id (Admin only)',
        delete: 'DELETE /api/products/:id (Admin only)'
      }
    }
  });
});

// Routes (mounted with /api and fallback root for maximum client compatibility)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`[Server] TechPulse API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = server;
