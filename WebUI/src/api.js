export function getApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL;
  if (raw && String(raw).trim()) return String(raw).replace(/\/$/, '');
  return 'http://localhost:5000';
}
