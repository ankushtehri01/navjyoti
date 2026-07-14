/**
 * Typed access to Vite environment variables.
 * Never read import.meta.env directly elsewhere.
 */
export const env = Object.freeze({
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  appName: import.meta.env.VITE_APP_NAME || 'Nav Jyoti',
  // Digits only, country code first, no '+' or spaces (wa.me link format).
  // TODO: replace the fallback with your real WhatsApp Business number.
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '919896704299',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
});

export default env;
