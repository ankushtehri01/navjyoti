/** Test env defaults applied before any module loads. */
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test_access_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
process.env.JWT_RESET_SECRET = 'test_reset_secret';
process.env.COOKIE_SECRET = 'test_cookie_secret';
process.env.CLIENT_URL = 'http://localhost:5173';
