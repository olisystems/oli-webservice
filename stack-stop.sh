# Backup soap service database
docker exec -t oli_webservice_postgres pg_dump -c -U postgres soap_service > db/backups/single/soap_service_db_dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

# Docker compose down
docker-compose -f docker-compose.yml down