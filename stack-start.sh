# Variables
DIR="api/dist"

# Remove api dist
if [ -d "$DIR" ]; then
    rm -rf "$DIR"
    printf '%s\n' "Removing Lock ($DIR)"
fi

# Build service
npm run --prefix api build

# Docker compose up
source ./.env
docker-compose -f docker-compose.yml up -d --build
