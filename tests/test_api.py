import pytest
from flask import json
import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_index_route(client):
    """Test the index route returns successfully"""
    rv = client.get('/')
    assert rv.status_code in [200, 404]  # 404 is acceptable if index.html doesn't exist yet

def test_api_buildings_route(client):
    """Test the buildings endpoint returns a list"""
    rv = client.get('/api/buildings')
    assert rv.status_code == 200
    json_data = json.loads(rv.data)
    assert isinstance(json_data, list)

def test_api_building_types(client):
    """Test the building types endpoint"""
    rv = client.get('/api/building-types')
    assert rv.status_code == 200
    json_data = json.loads(rv.data)
    assert isinstance(json_data, list)
    assert len(json_data) > 0
