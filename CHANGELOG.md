# Changelog

## [Unreleased]

### Added
- New infrastructure tiles:
  - Road: Basic road connections with dashed line pattern
  - Concrete: Foundation tiles with grid pattern
  - Grass: Decorative greenery with grass blade patterns
  - Tree: Natural shade with tree icon and trunk
  - Bridge: Special tile that can be placed on water to connect roads
- SVG patterns for each infrastructure type
- Special placement rules:
  - Bridges can be placed on water tiles
  - Roads can connect to bridges
- Visual improvements:
  - Distinct patterns for each tile type
  - Hover effects for infrastructure tiles
  - Better visual feedback when placing tiles
- New utility infrastructure:
  - Power infrastructure:
    - Power Lines (1x1): Transfer power between buildings
    - Solar Panels (2x2): Generate 100 kW of power
    - Wind Turbines (2x2): Generate 200 kW of power
  - Water infrastructure:
    - Water Pipes (1x1): Transfer water between buildings
    - Sewage Pipes (1x1): Transfer waste water
    - Water Tower (2x2): Store 1000m³ of water
    - Treatment Plant (3x3): Process 500m³/day of waste water
  - Transportation:
    - Parking Area (2x2): Space for 20 cars
- Size restrictions for buildings:
  - Small buildings (1x1): Roads, pipes, power lines
  - Medium buildings (2x2): Solar panels, wind turbines, water towers, parking
  - Large buildings (3x3): Treatment plants
- Building placement validation:
  - Checks for required space based on building size
  - Prevents overlap with existing buildings
  - Validates terrain compatibility (water/land)
- Map generation with terrain types:
  - Grass: Buildable green terrain
  - Water: Non-buildable blue terrain
  - Forest: Buildable dark green terrain
  - Mountain: Non-buildable rocky terrain
  - Desert: Buildable sandy terrain
- Building system with categories:
  - Residential: Houses, Apartments, Mansions
  - Commercial: Shops, Malls, Offices
  - Industrial: Factories, Warehouses, Power Plants
  - Infrastructure: Roads, Power Lines, Water Pipes
  - Public Services: Hospitals, Schools, Parks
- Resource costs for buildings:
  - Wood: Basic building material
  - Stone: Advanced building material
  - Gold: Premium building material
- Visual improvements:
  - Building icons displayed on placed hexes
  - Building names shown below icons
  - Infrastructure displayed as colored edges
  - Hover effects for hex selection
  - Smooth transitions and shadows
- Game interface:
  - Sidebar with accordion categories
  - Drag-and-drop building placement
  - Infrastructure edge placement system
  - Pan and zoom controls
  - Resource cost display with icons

### Changed
- Updated building placement system to handle both buildings and infrastructure
- Improved tile rendering with SVG patterns
- Enhanced UI with new infrastructure category in building panel
- Updated building placement system to handle multi-hex structures
- Enhanced infrastructure visualization with detailed SVG patterns
- Improved UI with categorized building types (Housing, Infrastructure, Utilities)
- Reduced map size to 61 hexes (4 rings) for better performance
- Updated building display to show inline hex icons
- Improved infrastructure placement with edge highlighting
- Enhanced UI with compact building items
- Streamlined terrain generation

### Fixed
- Building placement on water tiles now properly restricted
- SVG pattern scaling with zoom levels
- Building placement now properly checks adjacent hexes for larger structures
- Infrastructure connections now align correctly between hexes
- Pattern scaling with zoom levels
- Map centering and initialization
- Building placement validation
- Infrastructure edge connection system
- Accordion menu functionality
- API endpoint responses with proper logging

### Technical
- Added detailed logging to API endpoints
- Improved hex grid generation efficiency
- Enhanced building data structure
- Updated database schema for terrain and buildings
- Implemented proper drag-and-drop handling

## [1.1.0] - 2025-02-01

### Added
- Norwegian housing prices integration
- Detailed square meter calculations for buildings
- Dynamic population slider for larger homes
- Bootstrap 5 UI improvements
- Real-time cost estimation
- Resource usage summary
- New building types with accurate sizing
- Separate housing configuration system

### Changed
- Updated pricing to use NOK/m²
- Improved building placement logic for multi-hex structures
- Enhanced UI with Bootstrap components
- Reorganized code structure for better maintainability

### Fixed
- Multi-hex building placement validation
- Resource calculation accuracy
- UI responsiveness on different screen sizes

## [1.0.0] - 2025-01-31

### Added
- Initial game implementation
- Hexagonal grid system
- Basic building types
- Resource management
- Edge-based infrastructure
- Simple cost system
