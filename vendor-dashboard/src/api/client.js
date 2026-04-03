import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('cwc_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err.response?.data || { message: 'Network error' })
)

export default api
