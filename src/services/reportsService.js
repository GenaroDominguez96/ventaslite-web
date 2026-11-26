import apiClient from './apiClient'

const reportsService = {
  async getDashboard(params) {
    const response = await apiClient.get('/reports/dashboard', { params })
    return response.data
  },

  async getMonthlySales(params) {
    const response = await apiClient.get('/reports/monthly-sales', { params })
    return response.data
  },

  async getTopProducts(params) {
    const response = await apiClient.get('/reports/top-products', { params })
    return response.data
  },

  async getSellerRanking(params) {
    const response = await apiClient.get('/reports/sellers', { params })
    return response.data
  },

  async getBranchCategory(params) {
    const response = await apiClient.get('/reports/branch-category', { params })
    return response.data
  },

  async getMargins(params) {
    const response = await apiClient.get('/reports/margins', { params })
    return response.data
  },

  async askAssistant(data) {
    const response = await apiClient.post('/reports/assistant', data, {
      timeout: 75000,
    })
    return response.data
  },

  async getExecutiveSummary(params) {
    const response = await apiClient.post('/reports/executive-summary', params, {
      timeout: 75000,
    })
    return response.data
  },

  async exportReport(report, params = {}) {
    const response = await apiClient.get(`/reports/${report}/export`, {
      params,
      responseType: 'blob',
    })

    const objectUrl = URL.createObjectURL(response.data)
    const link = document.createElement('a')
    const disposition = response.headers['content-disposition'] || ''
    const filename = disposition.match(/filename="?([^"]+)"?/i)?.[1]
      || `ventaslite_${report}.csv`

    link.href = objectUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  },
}

export default reportsService
