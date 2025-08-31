#!/bin/bash

# Setup script for environment variables
echo "Setting up environment variables for Counter App..."

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
# Replace these values with your actual Supabase project credentials
VITE_SUPABASE_URL=https://YOURPROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key

# Counter Configuration (optional - defaults are in config.js)
# VITE_COUNTER_NAMESPACE=global
# VITE_COUNTER_KEY=clicks
EOF

echo "✅ .env.local file created successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local and replace the placeholder values with your actual Supabase credentials"
echo "2. Run 'npm install' to install dependencies"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "🔒 Security note: .env.local is automatically ignored by Git and won't be committed"
