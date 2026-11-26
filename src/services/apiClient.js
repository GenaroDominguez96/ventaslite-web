import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// La autenticación y los interceptores se agregarán cuando se implemente el login.
// Este cliente no ejecuta solicitudes automáticamente.

export default apiClient
