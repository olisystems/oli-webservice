
# Remove service dist
rm -r api/dist

# Build service
npm run --prefix api build

# Docker compose up
source ./.env
docker-compose -f docker-compose.yml up -d --build
