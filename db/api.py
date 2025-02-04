from flask import Flask, jsonify
from init_db import (
    get_assets_by_category,
    get_asset_resources,
    get_connection_rules,
    get_placement_requirements
)

app = Flask(__name__)

@app.route('/api/assets/<category>', methods=['GET'])
def assets_by_category(category):
    """Get all assets in a category with their properties"""
    assets = get_assets_by_category(category)
    return jsonify(assets)

@app.route('/api/assets/<int:asset_id>/resources', methods=['GET'])
def asset_resources(asset_id):
    """Get resource production/consumption for an asset"""
    resources = get_asset_resources(asset_id)
    return jsonify(resources)

@app.route('/api/assets/<int:asset_id>/connections', methods=['GET'])
def asset_connections(asset_id):
    """Get connection rules for an asset"""
    connections = get_connection_rules(asset_id)
    return jsonify(connections)

@app.route('/api/assets/<int:asset_id>/requirements', methods=['GET'])
def asset_requirements(asset_id):
    """Get placement requirements for an asset"""
    requirements = get_placement_requirements(asset_id)
    return jsonify(requirements)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
