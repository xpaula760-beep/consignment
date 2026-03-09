import axios from 'axios';

const rawBase = process.env.NEXT_PUBLIC_API_URL || '';
const normalizedBase = rawBase ? rawBase.replace(/\/$/, '') + '/api' : '/api';

const api = axios.create({
  baseURL: normalizedBase,
  withCredentials: true
});

export default api;
