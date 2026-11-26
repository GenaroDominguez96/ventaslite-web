import apiClient from './apiClient'

const salesService = {
  async getSales(params = {}) {
    const response = await apiClient.get('/sales', { params })
    return response.data
  },

  async getSale(id) {
    const response = await apiClient.get(`/sales/${id}`)
    return response.data
  },

  async createSale(payload) {
    const response = await apiClient.post('/sales', payload)
    return response.data
  },

  async cancelSale(id) {
    const response = await apiClient.post(`/sales/${id}/cancel`)
    return response.data
  },

  async getBranches() {
    const response = await apiClient.get('/branches')
    return response.data
  },

  async getCategories() {
    const response = await apiClient.get('/categories')
    return response.data
  },

  async getProducts(params = {}) {
    const response = await apiClient.get('/products', { params })
    return response.data
  },

  async getSellers() {
    const response = await apiClient.get('/sellers')
    return response.data
  },
}

export default salesService
