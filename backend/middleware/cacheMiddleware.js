// In-memory catalog cache with auto-invalidation
const cache = new Map();
const TTL_MS = 60 * 1000; // 60 seconds cache duration

const cacheMiddleware = (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl;
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < TTL_MS) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cached.data);
  }

  // Intercept json method to store in cache
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200 && body && body.success) {
      cache.set(key, { data: body, timestamp: Date.now() });
    }
    res.setHeader('X-Cache', 'MISS');
    return originalJson(body);
  };

  next();
};

const invalidateCache = () => {
  cache.clear();
  console.log('[Cache] In-memory catalog cache invalidated');
};

module.exports = { cacheMiddleware, invalidateCache };
