#!/bin/bash

echo "============================================"
echo "FastFind360 - Setup Script"
echo "Open Buildings + Google Maps Integration"
echo "============================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✓ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Google Maps API key!"
    echo "   Get your key from: https://console.cloud.google.com/google/maps-apis"
    echo ""
else
    echo "✓ .env.local already exists"
fi

# Install Node dependencies
echo ""
echo "📦 Installing Node.js dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✓ Node dependencies installed"
else
    echo "❌ Failed to install Node dependencies"
    exit 1
fi

# Check if Python is available
echo ""
echo "🐍 Checking for Python..."
if command -v python3 &> /dev/null; then
    echo "✓ Python 3 found: $(python3 --version)"
    
    # Check if data file exists
    if [ ! -f public/data/gombe_open_buildings.geojson ]; then
        echo ""
        echo "📊 Fetching Open Buildings data for Gombe..."
        echo "   This will generate sample data (or download real data if kagglehub is installed)"
        
        cd scripts
        python3 fetch_open_buildings.py
        cd ..
        
        if [ $? -eq 0 ]; then
            echo "✓ Building data ready"
        else
            echo "⚠️  Warning: Could not fetch building data, will generate at runtime"
        fi
    else
        echo "✓ Building data already exists"
    fi
else
    echo "⚠️  Python 3 not found. Install Python to fetch Open Buildings data."
    echo "   The app will work with generated sample data."
fi

echo ""
echo "============================================"
echo "✓ Setup Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "1. Edit .env.local and add your Google Maps API key"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:5173"
echo ""
echo "For detailed setup instructions, see SETUP_GOOGLE_MAPS.md"
echo ""
