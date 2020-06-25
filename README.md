# Oli Webservice
Oli Webservice provides a soap service implementation to receive post requests with smart meter data.

## Installation
The service stack consists of three main components:

- Database (Postgres)
- API (NodeJS)
- Reverse Proxy (Nginx)

The service can be installed by composing up all stack components in a docker docker composition or installing the required services natively.

### Docker

#### Requirements
- Docker >= 17
- Docker compose

#### Run the docker composition
To start up the docker composition simply run the following command in the project root directory:
```
./stack-start.sh
```
**Note:** The ```stack-start.sh``` script needs to have executable permissions.

The docker composition starts up the following containers:
| Name  | Image | Purpose |
|---|---|---|
| oli_webservice_postgres | Postgres:12 | Database |
| oli_webservicegit_pgbackups | prodrigestivill/postgres-backup-local | Database backup service |
| oli_webservice_api | node:14 | Application Server |
| oli_webservice_nginx | nginx:latest | Reverse proxy |

#### Configuration
##### Dotenv
The following configurations must be applied by setting environmet variables in a `.env` file in the project root directory according to the [.env.example file](./.env.example) in the project root directory. The following environmet varialbes must be set:
| Name  | Description | Example | Note |
|---|---|---|---|
| NODE_ENV | NodeJs application server environment | production |  |
| SERVER_PORT | NodeJs server port | 8000 | Docker internal and expose |
| PG_HOST | Postgres host | db | Name of the postgres container of the docker compose file|
| PG_PORT | Postgres port (docker internal) | 5432 | Has always to be 5432 |
| PG_PORT_EXPOSE | Postgres port (docker expose) | 5432 | Can be any free port of the host machine |
| PG_USER | Postgres user | postgres-user |  |
| PG_PASSWORD | Postgres password | a-secure-password |  |
| PG_DATABASE | Postgres database | soap_service | Has always to be soap_service |

##### Nginx default config
The service is protected by an IP filter. The IP Filter can be set by the `allow` variable in the `location /cb-emt-meterData/soap/v1/meterDataCollectionOut` section in the [nginx default configuration](nginx/default.conf):
```
location /cb-emt-meterData/soap/v1/meterDataCollectionOut {
    
    ...
    
    allow 197.84.12.143/24;
    deny all;
}
```

The Nginx reverse proxy requires a SSL certificate too run in https mode. The certificate must be located under `nginx/certs/` and are configured in the [nginx default configuration](nginx/default.conf):
```
server {

    ...

    ssl_certificate /etc/nginx/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/nginx/certs/nginx-selfsigned.key;
}
```

##### Initial users
To use the service, initial users have to be created. This is done, by editing the end of the SQL script [db/installation/installation.sql](db/installation/installation.sql). The password must be a $2b$ prefix bcrypt hashed password with 10 numbers of round.
```
insert into public.t_users ( name, password, is_admin ) values ('admin-user', '$2b$-hashed-password', true);
insert into public.t_users (name, password, is_admin ) values ('normal-user', '$2b$-hashed-password', false);
```
**Note:** Due to security reasons, the passwords for all initial created users should be changed through the user API (described in API section) after the Service was started.

### Single Services
For development purposes or any other reasons, the service can be started, by installing the technologies of the single stack components on the host machine or a local computer and start them.

#### Requirements
- Node >= 10
- PostgreSQL >= 12
- Nginx >= 1.18

#### Configuration

##### API
To configure the API, all environmet variables must be set in a `.env` file in the directory `api/` according to the [api/.env.example file](api/.env.example). See the Dotenv table in the docker section for a detailed description of the environment variables.

##### Nginx
An example nginx configuration can be found under [nginx/default.conf](nginx/default.conf).

##### PostgreSQL
The database can be initialized through the SQL script [db/installation/installation.sql](db/installation/installation.sql). The passwords in the insert user section of the script must be a $2b$ prefix bcrypt hashed password with 10 numbers of round.
```
insert into public.t_users ( name, password, is_admin ) values ('admin-user', '$2b$-hashed-password', true);
insert into public.t_users (name, password, is_admin ) values ('normal-user', '$2b$-hashed-password', false);
```
**Note:** Due to security reasons, the passwords for all initial created users should be changed through the user API (described in API section) after the Service was started.

## Usage

## Integration tests
