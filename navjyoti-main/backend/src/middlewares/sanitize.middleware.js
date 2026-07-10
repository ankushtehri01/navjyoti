/**
 * Express-5-safe NoSQL-injection sanitizer.
 *
 * The popular `express-mongo-sanitize` reassigns `req.query`, which is a
 * read-only getter in Express 5 and throws. This middleware instead strips
 * keys containing `$` or `.` (Mongo operator / dot-path injection vectors)
 * by mutating body/params in place and redefining `req.query` safely.
 */

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const sanitize = (obj) => {
  if (Array.isArray(obj)) {
    obj.forEach(sanitize);
    return obj;
  }
  if (!isPlainObject(obj)) return obj;

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }
    sanitize(obj[key]);
  }
  return obj;
};

export const mongoSanitize = (req, _res, next) => {
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);

  // req.query is a getter in Express 5 — sanitize a copy and redefine it.
  if (req.query && Object.keys(req.query).length > 0) {
    const cleaned = sanitize({ ...req.query });
    Object.defineProperty(req, 'query', {
      value: cleaned,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  }

  next();
};

export default mongoSanitize;
