// Constants
const HEX_SIZE = 40;
const SQRT3 = Math.sqrt(3);
const MOVEMENT_STEP = 50;
const MAP_RADIUS = 6;  // Increased from 3 to 6 for a larger map

// Constants for API paths
const API_BASE_URL = 'http://localhost:5000';  // Explicitly set the server URL
const API_ENDPOINTS = {
    BUILDINGS: `${API_BASE_URL}/api/buildings`
};

// Retry configuration
const RETRY_CONFIG = {
    MAX_RETRIES: 3,
    INITIAL_DELAY: 1000, // 1 second
    MAX_DELAY: 5000 // 5 seconds
};

// Game state
let gameState = {
    zoom: 1,
    offset: { x: 0, y: 0 },
    hexSize: 40,
    buildings: [],
    selectedTerrainType: null,
    selectedBuilding: null,
    hexGrid: new Map(),
    loading: true,
    loadingErrors: [],
    mousePosition: { x: 0, y: 0 },
    hoveredHex: null,
    placedBuildings: {},  // Track count of each building type
    resources: {
        gold: 1000,
        wood: 500,
        stone: 300
    }
};

// Initialize loading screen
function showLoadingScreen() {
    console.log('Showing loading screen...');
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loadingScreen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <h2>Loading Game...</h2>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
            <div class="loading-status">Initializing...</div>
        </div>
    `;
    document.body.appendChild(loadingScreen);
    console.log('Loading screen added to DOM');
}

// Update loading progress
function updateLoadingProgress(status, progress) {
    console.log(`Loading progress: ${status} (${progress}%)`);
    const loadingStatus = document.querySelector('.loading-status');
    const loadingProgress = document.querySelector('.loading-progress');
    if (loadingStatus) loadingStatus.textContent = status;
    if (loadingProgress) loadingProgress.style.width = `${progress}%`;
}

// Hide loading screen
function hideLoadingScreen() {
    console.log('Hiding loading screen...');
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.remove(), 500);
        console.log('Loading screen removed');
    }
}

// Load game assets
async function loadGameAssets() {
    try {
        console.log('Starting to load game assets...');
        showLoadingScreen();
        
        // Load buildings (50%)
        updateLoadingProgress('Loading buildings...', 0);
        await loadBuildings();
        console.log('Buildings loaded');
        
        // Initialize game map (75%)
        updateLoadingProgress('Initializing game map...', 50);
        setupGameMap();
        console.log('Game map initialized');
        
        // Setup UI components (100%)
        updateLoadingProgress('Setting up interface...', 75);
        setupAccordion();
        setupControls();
        setupTerrainSelection();
        console.log('UI components set up');
        
        // Complete loading
        updateLoadingProgress('Ready!', 100);
        setTimeout(() => {
            hideLoadingScreen();
            gameState.loading = false;
            console.log('Game fully loaded');
        }, 500);
        
    } catch (error) {
        console.error('Error loading game assets:', error);
        gameState.loadingErrors.push(error.message);
        updateLoadingProgress(`Error: ${error.message}`, 0);
    }
}

// Initialize the game
async function initializeGame() {
    console.log('Game initialization started...');
    await loadGameAssets();
}

// Helper function to load data with retry logic
async function loadWithRetry(url, maxRetries = RETRY_CONFIG.MAX_RETRIES) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`Attempt ${i + 1} to load ${url}`);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log(`Successfully loaded data from ${url}`);
            return data;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === maxRetries - 1) throw error;
            const delay = Math.min(RETRY_CONFIG.INITIAL_DELAY * Math.pow(2, i), RETRY_CONFIG.MAX_DELAY);
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Load buildings
async function loadBuildings() {
    try {
        gameState.buildings = await loadWithRetry(API_ENDPOINTS.BUILDINGS);
        console.log('Buildings loaded:', gameState.buildings);
        
        // Populate building cards
        gameState.buildings.forEach(building => {
            const category = building.category.toLowerCase();
            const grid = document.querySelector(`[data-category="${category}"]`)
                ?.nextElementSibling
                ?.querySelector('.building-grid');
                
            if (grid) {
                // Create building card elements manually instead of using template
                const card = document.createElement('div');
                card.className = 'building-card';
                card.setAttribute('data-building-code', building.code);
                
                const hex = document.createElement('div');
                hex.className = 'building-hex';
                
                const icon = document.createElement('i');
                icon.className = `fas ${building.icon}`;
                hex.appendChild(icon);
                
                const name = document.createElement('div');
                name.className = 'building-name';
                name.textContent = building.name;
                
                card.appendChild(hex);
                card.appendChild(name);
                
                // Add click handler for building selection
                card.addEventListener('click', () => {
                    // Deselect terrain type when selecting a building
                    gameState.selectedTerrainType = null;
                    d3.selectAll('.terrain-item').classed('active', false);
                    
                    // Toggle building selection
                    if (gameState.selectedBuilding === building.code) {
                        gameState.selectedBuilding = null;
                        document.querySelectorAll('.building-card').forEach(card => 
                            card.classList.remove('selected'));
                    } else {
                        gameState.selectedBuilding = building.code;
                        document.querySelectorAll('.building-card').forEach(card => 
                            card.classList.remove('selected'));
                        card.classList.add('selected');
                    }
                    
                    updateCursorStyle();
                });
                
                grid.appendChild(card);
            }
        });
    } catch (error) {
        console.error('Failed to load buildings:', error);
        gameState.loadingErrors.push('Failed to load buildings');
        throw error;
    }
}

// Setup game map
function setupGameMap() {
    const svg = d3.select('#gameMap')
        .attr('width', '100%')
        .attr('height', '100%');

    // Clear existing content
    svg.selectAll('*').remove();

    // Add mouse move handler for the entire SVG
    svg.on('mousemove', function(event) {
        if (!gameState.selectedTerrainType) return;
        
        const point = d3.pointer(event);
        gameState.mousePosition = { x: point[0], y: point[1] };
        
        // Remove highlight from previously hovered hex
        if (gameState.hoveredHex) {
            d3.select(gameState.hoveredHex)
                .select('path')
                .attr('stroke-width', '2')
                .attr('stroke', '#475569');
        }
        
        // Find and highlight the hex under the mouse
        const hex = document.elementFromPoint(event.clientX, event.clientY);
        if (hex && hex.closest('.hex')) {
            const hexElement = hex.closest('.hex');
            gameState.hoveredHex = hexElement;
            d3.select(hexElement)
                .select('path')
                .attr('stroke-width', '3')
                .attr('stroke', '#60a5fa');
        }
    });

    // Create the hex grid
    createHexGrid();
}

// Create hex grid
function createHexGrid() {
    console.log('Creating hex grid...');
    const svg = d3.select('#gameMap');
    
    // Calculate viewBox dimensions
    const width = document.getElementById('gameMap').clientWidth;
    const height = document.getElementById('gameMap').clientHeight;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Create hexbin layout
    const hexbin = d3.hexbin()
        .radius(gameState.hexSize)
        .extent([[0, 0], [width, height]]);

    // Generate hex points
    const points = [];
    const radius = MAP_RADIUS;
    for (let q = -radius; q <= radius; q++) {
        const r1 = Math.max(-radius, -q - radius);
        const r2 = Math.min(radius, -q + radius);
        for (let r = r1; r <= r2; r++) {
            const x = gameState.hexSize * (SQRT3 * q + SQRT3/2 * r);
            const y = gameState.hexSize * (3/2 * r);
            points.push({
                q, r,
                x: x + gameState.offset.x,
                y: y + gameState.offset.y,
                terrain: 'grass',
                building: null
            });
        }
    }

    // Create hex group
    const hexes = svg.append('g')
        .selectAll('g')
        .data(points)
        .enter().append('g')
        .attr('class', 'hex')
        .attr('transform', d => `translate(${d.x + width/2},${d.y + height/2})`)
        .on('click', function(event, d) {
            if (gameState.selectedTerrainType) {
                // Handle terrain placement
                const hex = d3.select(this);
                hex.select('path')
                    .attr('fill', getTerrainColor(gameState.selectedTerrainType))
                    .attr('class', `hex-background terrain-${gameState.selectedTerrainType}`)
                    .attr('data-terrain', gameState.selectedTerrainType);
                
                d.terrain = gameState.selectedTerrainType;
                
                // Reset hover effect after placing terrain
                hex.select('path')
                    .attr('stroke-width', '2')
                    .attr('stroke', '#475569');
            } else if (gameState.selectedBuilding) {
                // Check if we can afford the building
                if (!canAffordBuilding(gameState.selectedBuilding)) {
                    console.log('Cannot afford building');
                    return;
                }

                // Handle building placement
                const hex = d3.select(this);
                const building = gameState.buildings.find(b => b.code === gameState.selectedBuilding);
                
                if (building) {
                    // Remove existing building if any
                    if (d.building) {
                        // Refund old building
                        gameState.placedBuildings[d.building]--;
                        updateSummary();
                    }
                    hex.select('.building-icon').remove();
                    
                    // Add building icon
                    hex.append('text')
                        .attr('class', 'building-icon fas')
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'central')
                        .attr('font-size', '20px')
                        .attr('fill', building.color)
                        .text(() => {
                            // Convert FontAwesome class to actual unicode character
                            const iconClass = building.icon.replace('fa-', '');
                            return String.fromCharCode(parseInt(iconClass, 16));
                        });
                    
                    // Store building reference and update count
                    d.building = building.code;
                    gameState.placedBuildings[building.code] = (gameState.placedBuildings[building.code] || 0) + 1;
                    
                    // Deduct costs
                    deductBuildingCosts(building.code);
                    updateSummary();
                }
            }
        });

    // Draw hex backgrounds
    hexes.append('path')
        .attr('d', hexbin.hexagon())
        .attr('class', 'hex-background')
        .attr('fill', '#90b53d')
        .attr('stroke', '#475569')
        .attr('stroke-width', '2');

    console.log('Hex grid created');
}

// Helper function to get terrain colors
function getTerrainColor(terrain) {
    const colors = {
        'mountain': '#9ca3af',
        'fields': '#fbbf24',
        'pasture': '#34d399',
        'desert': '#fcd34d',
        'water': '#60a5fa'
    };
    return colors[terrain] || '#90b53d';
}

// Setup terrain selection
function setupTerrainSelection() {
    const terrainTypes = ['mountain', 'fields', 'pasture', 'desert', 'water'];
    const terrainGrid = d3.select('#terrainGrid');
    
    // Clear existing content
    terrainGrid.selectAll('*').remove();
    
    terrainTypes.forEach(type => {
        const item = terrainGrid.append('div')
            .attr('class', 'terrain-item')
            .on('click', () => {
                // Remove active class from all items
                terrainGrid.selectAll('.terrain-item').classed('active', false);
                // Add active class to selected item
                item.classed('active', true);
                
                // Update selected terrain type
                if (gameState.selectedTerrainType === type) {
                    // Deselect if clicking the same type
                    gameState.selectedTerrainType = null;
                    item.classed('active', false);
                } else {
                    gameState.selectedTerrainType = type;
                }
                
                // Update cursor style on game map
                updateCursorStyle();
            });

        item.append('div')
            .attr('class', `terrain-preview terrain-${type}`);

        item.append('div')
            .attr('class', 'terrain-name')
            .text(type.charAt(0).toUpperCase() + type.slice(1));
    });
}

// Update cursor style based on selection
function updateCursorStyle() {
    const gameMap = d3.select('#gameMap');
    if (gameState.selectedTerrainType) {
        gameMap.style('cursor', 'crosshair');
    } else if (gameState.selectedBuilding) {
        gameMap.style('cursor', 'pointer');
    } else {
        gameMap.style('cursor', 'default');
    }
}

// Setup accordion functionality
function setupAccordion() {
    console.log('Setting up accordion...');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Setup game controls
function setupControls() {
    console.log('Setting up game controls...');
    // Movement controls
    document.getElementById('moveUp').addEventListener('click', () => moveMap(0, -50));
    document.getElementById('moveDown').addEventListener('click', () => moveMap(0, 50));
    document.getElementById('moveLeft').addEventListener('click', () => moveMap(-50, 0));
    document.getElementById('moveRight').addEventListener('click', () => moveMap(50, 0));

    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', () => zoom(1.2));
    document.getElementById('zoomOut').addEventListener('click', () => zoom(0.8));

    // Window resize handler
    window.addEventListener('resize', () => {
        setupGameMap();
    });
}

// Move map
function moveMap(dx, dy) {
    console.log('Moving map...');
    gameState.offset.x += dx;
    gameState.offset.y += dy;
    createHexGrid();
}

// Zoom map
function zoom(factor) {
    console.log('Zooming map...');
    const newZoom = gameState.zoom * factor;
    if (newZoom >= 0.5 && newZoom <= 2) {
        console.log(`Zooming map: ${gameState.zoom} -> ${newZoom}`);
        gameState.zoom = newZoom;
        gameState.hexSize = 40 * gameState.zoom;
        createHexGrid();
    }
}

// Update summary display
function updateSummary() {
    const summaryList = document.getElementById('buildingSummary');
    summaryList.innerHTML = '';

    // Update building counts
    Object.entries(gameState.placedBuildings).forEach(([code, count]) => {
        if (count > 0) {
            const building = gameState.buildings.find(b => b.code === code);
            if (building) {
                const item = document.createElement('div');
                item.className = 'summary-item';
                item.innerHTML = `
                    <i class="fas ${building.icon}"></i>
                    <span>${building.name}: ${count}</span>
                `;
                summaryList.appendChild(item);
            }
        }
    });

    // Update resources
    document.getElementById('goldCount').textContent = gameState.resources.gold;
    document.getElementById('woodCount').textContent = gameState.resources.wood;
    document.getElementById('stoneCount').textContent = gameState.resources.stone;
}

// Check if player can afford building
function canAffordBuilding(buildingCode) {
    const costs = gameState.buildings.find(b => b.code === buildingCode)?.costs;
    if (!costs) return true;  // If no costs defined, assume it's free

    return (
        gameState.resources.gold >= costs.gold &&
        gameState.resources.wood >= costs.wood &&
        gameState.resources.stone >= costs.stone
    );
}

// Deduct building costs
function deductBuildingCosts(buildingCode) {
    const costs = gameState.buildings.find(b => b.code === buildingCode)?.costs;
    if (!costs) return;

    gameState.resources.gold -= costs.gold;
    gameState.resources.wood -= costs.wood;
    gameState.resources.stone -= costs.stone;
    updateSummary();
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing game...');
    initializeGame();
});
