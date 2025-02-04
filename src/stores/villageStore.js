import { defineStore } from 'pinia'
import axios from 'axios'

export const useVillageStore = defineStore('village', {
  state: () => ({
    buildingTypes: [],
    placedBuildings: [],
    sustainabilityMetrics: {
      powerBalance: 0,
      totalOccupancy: 0
    }
  }),
  actions: {
    async fetchBuildingTypes() {
      try {
        const response = await axios.get('/api/building-types')
        this.buildingTypes = response.data
      } catch (error) {
        console.error('Failed to fetch building types:', error)
      }
    },
    async placeBuilding(buildingData) {
      try {
        const response = await axios.post('/api/place-building', buildingData)
        if (response.data.status === 'success') {
          this.placedBuildings.push({
            ...buildingData,
            id: response.data.id
          })
          this.updateSustainabilityMetrics()
        }
      } catch (error) {
        console.error('Failed to place building:', error)
      }
    },
    updateSustainabilityMetrics() {
      this.sustainabilityMetrics.powerBalance = this.calculatePowerBalance()
      this.sustainabilityMetrics.totalOccupancy = this.calculateTotalOccupancy()
    },
    calculatePowerBalance() {
      return this.placedBuildings.reduce((balance, building) => {
        const buildingType = this.buildingTypes.find(bt => bt.id === building.typeId)
        return buildingType 
          ? balance + (buildingType.powerGeneration - buildingType.powerConsumption)
          : balance
      }, 0)
    },
    calculateTotalOccupancy() {
      return this.placedBuildings.reduce((total, building) => {
        const buildingType = this.buildingTypes.find(bt => bt.id === building.typeId)
        return buildingType 
          ? total + (buildingType.maxOccupancy || 0)
          : total
      }, 0)
    }
  }
})
