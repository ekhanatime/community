// Norwegian housing prices (NOK/m²) - Average prices for different areas
const HOUSING_PRICES = {
    URBAN: 85000,    // Oslo average
    SUBURBAN: 65000, // Greater Oslo area
    RURAL: 45000     // Rural Norway
};

class HousingUnit {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.size = config.size; // in m²
        this.minOccupants = config.minOccupants;
        this.maxOccupants = config.maxOccupants;
        this.currentOccupants = config.minOccupants;
        this.powerUsage = config.powerUsage; // kWh per month
        this.waterUsage = config.waterUsage; // m³ per month
        this.hexSize = Math.ceil(this.size / 225); // Each hex is 15x15m = 225m²
        this.pricePerSqm = HOUSING_PRICES.SUBURBAN;
        this.maintenanceCost = config.maintenanceCost || this.size * 100; // NOK per month
        this.parkingSpaces = Math.ceil(this.maxOccupants / 2);
    }

    getTotalCost() {
        return this.size * this.pricePerSqm;
    }

    getMonthlyExpenses() {
        return {
            maintenance: this.maintenanceCost,
            power: this.powerUsage * 1.5, // 1.5 NOK per kWh
            water: this.waterUsage * 25   // 25 NOK per m³
        };
    }

    setOccupants(count) {
        this.currentOccupants = Math.min(Math.max(count, this.minOccupants), this.maxOccupants);
        this.updateResourceUsage();
    }

    updateResourceUsage() {
        // Adjust resource usage based on occupants
        const occupancyRatio = this.currentOccupants / this.maxOccupants;
        this.currentPowerUsage = this.powerUsage * occupancyRatio;
        this.currentWaterUsage = this.waterUsage * occupancyRatio;
    }
}

// Predefined housing types
const housingTypes = {
    STUDIO: new HousingUnit({
        id: 'studio',
        name: 'Studio Apartment',
        size: 25,
        minOccupants: 1,
        maxOccupants: 2,
        powerUsage: 250,
        waterUsage: 4,
        maintenanceCost: 2500
    }),
    
    APARTMENT: new HousingUnit({
        id: 'apartment',
        name: 'Standard Apartment',
        size: 65,
        minOccupants: 2,
        maxOccupants: 4,
        powerUsage: 400,
        waterUsage: 8,
        maintenanceCost: 6500
    }),
    
    HOUSE: new HousingUnit({
        id: 'house',
        name: 'Family House',
        size: 120,
        minOccupants: 4,
        maxOccupants: 6,
        powerUsage: 800,
        waterUsage: 15,
        maintenanceCost: 12000
    })
};

// Function to create a custom housing unit
function createCustomHousing(config) {
    return new HousingUnit(config);
}

// Calculate total resource usage for all housing
function calculateTotalResourceUsage(placedHousing) {
    return placedHousing.reduce((total, house) => {
        const expenses = house.getMonthlyExpenses();
        return {
            power: total.power + house.currentPowerUsage,
            water: total.water + house.currentWaterUsage,
            maintenance: total.maintenance + expenses.maintenance,
            totalCost: total.totalCost + house.getTotalCost()
        };
    }, { power: 0, water: 0, maintenance: 0, totalCost: 0 });
}
