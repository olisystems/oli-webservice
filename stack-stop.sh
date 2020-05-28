
# Backup keycloak realm oli-webservice
docker exec -it oli-webservicegit_keycloak_1 /opt/jboss/keycloak/bin/standalone.sh \
-Djboss.socket.binding.port-offset=100 -Dkeycloak.migration.action=export \
-Dkeycloak.migration.provider=singleFile \
-Dkeycloak.migration.realmName=oli-webservice \
-Dkeycloak.migration.usersExportStrategy=REALM_FILE \
-Dkeycloak.migration.file=/tmp/realm/export/oli-webservice-realm.json

# Docker compose down
docker-compose -f docker-compose.yml down