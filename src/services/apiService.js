import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  async getBuildingTypes() {
    const response = await apiClient.get('/building-types')
    return response.data
  },
  async placeBuildingInstance(buildingData) {
    const response = await apiClient.post('/place-building', buildingData)
    return response.data
  }
}
