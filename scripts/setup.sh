#!/usr/bin/env bash
set -euo pipefail

echo "=== SaaS Template Setup ==="
echo ""

# Get app name
read -p "Enter your app name (e.g., myapp): " APP_NAME
APP_NAME_LOWER=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]')
APP_NAME_UPPER=$(echo "$APP_NAME" | tr '[:lower:]' '[:upper:]')

echo ""
echo "Setting up project: $APP_NAME"
echo ""

# Generate secret key
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(48))" 2>/dev/null || openssl rand -base64 48)

# Replace placeholders
echo "Replacing placeholders..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    SED_CMD="sed -i ''"
else
    SED_CMD="sed -i"
fi

find . -type f \( -name "*.py" -o -name "*.ts" -o -name "*.tsx" -o -name "*.yaml" -o -name "*.yml" -o -name "*.json" -o -name "*.md" -o -name "*.sh" -o -name "*.sql" -o -name "*.toml" -o -name "*.cfg" -o -name ".env*" -o -name "Makefile" -o -name "Dockerfile" \) \
    -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/venv/*" | while read -r file; do
    $SED_CMD "s/MYAPP/${APP_NAME_UPPER}/g" "$file"
    $SED_CMD "s/myapp/${APP_NAME_LOWER}/g" "$file"
    $SED_CMD "s/MyApp/${APP_NAME}/g" "$file"
done

# Create .env
echo "Creating .env file..."
cp .env.example .env
$SED_CMD "s/your-secret-key-here/${SECRET_KEY}/g" .env

# Install Python deps
echo "Installing Python dependencies..."
cd src
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt -r ../requirements-dev.txt
cd ..

# Install frontend deps
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Init git
if [ ! -d .git ]; then
    git init
    ./scripts/install-hooks.sh
fi

echo ""
echo "=== Setup Complete ==="
echo "App name: $APP_NAME"
echo "Secret key: generated and saved to .env"
echo ""
echo "Next steps:"
echo "  1. Create database: createdb ${APP_NAME_LOWER}"
echo "  2. Deploy schema: psql -d ${APP_NAME_LOWER} -f sql/deploy.sql"
echo "  3. Start services: python3 monitor.py --start-all"
echo "  4. Open: http://localhost:5173"
