# Oli Webservice
Oli Webservice provides a [soap service implementation](resources/MeterDataCollectionOut.svc.wsdl) to receive post requests with smart meter data.

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
**Note:** The [stack-start.sh](stack-start.sh) script needs to have executable permissions.

The docker composition starts up the following containers:
| Name | Image | Purpose |
|---|---|---|
| oli_webservice_postgres | Postgres:12 | Database |
| oli_webservicegit_pgbackups | prodrigestivill/postgres-backup-local | Database backup service |
| oli_webservice_api | node:14 | Application Server |
| oli_webservice_nginx | nginx:latest | Reverse proxy |

#### Configuration
##### Dotenv
The following configurations must be applied by setting environmet variables in a `.env` file in the project root directory according to the [.env.example file](./.env.example) in the project root directory. The following environmet varialbes must be set:
| Name | Description | Example | Note |
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

The service is separated into a SOAP service and a rest API which are implementing the following endpoint structure:
- `<host>/cb-emt-meterData/soap/v1/<resource>`
- `<host>/cb-emt-meterData/rest/v1/<resource>`
Authentication is applied by a basic authentication in the request header.

### Meter data collection out

| Method | Endpoint | Type | Parameter | Body | Auth Role | Response |
|---|---|---|---|---|---|---|
| GET | `<host>`/cb-emt-meterData/soap/v1/meterDataCollectionOut | REST |  |  | Admin | `200` meterData data structure (json) |
| POST | `<host>`/cb-emt-meterData/soap/v1/meterDataCollectionOut | SOAP |  | meterData data structure (xml) | User | `201` meterData data structure (xml) |

### Users

| Method | Endpoint | Type | Parameter | Body | Auth Role | Response |
|---|---|---|---|---|---|---|
| GET | `<host>`/cb-emt-meterData/rest/v1/users | REST |  |  | Admin | `200` [] user data structure (json) |
| GET | `<host>`/cb-emt-meterData/rest/v1/users/:pk | REST |  |  | Admin | `200` user data structure (json) |
| POST | `<host>`/cb-emt-meterData/rest/v1/users | REST |  | user data structure (json) | Admin | `201` user data structure (json) |
| PATCH | `<host>`/cb-emt-meterData/rest/v1/users/:pk | REST |  | user data structure (json) | Admin | `200` user data structure (json) |
| DELETE | `<host>`/cb-emt-meterData/rest/v1/users/:pk | REST |  |  | Admin | `200` user data structure (json) |

## Data structure

### Meter data collection out

#### XML
[Meter data collection out: ](resources/datastructure-meter-data-collection-out.xml)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ns2:ForwardMeterData xmlns:ns2="http://enbw.com/esr/SAPPO/Netze/Messsysteme/MeterDataCollection">
    <MessageHeader>
        <MessageId systemName="RSS">d072a097-8fff-48e0-b3a9-64411ab3c53b</MessageId>
        <TimeSent>2020-06-26T14:15:49.933+02:00</TimeSent>
        <InstanceId>MDCS_001</InstanceId>
        <TenantId>1000</TenantId>
        <MeterOperatorId>9903916000000</MeterOperatorId>
        <ExternalMarketParticipantId>9903916000000</ExternalMarketParticipantId>
        <RoutingKeyServiceBus>WIRCON</RoutingKeyServiceBus>
    </MessageHeader>
    <SmgwId>EDNT0018068446</SmgwId>
    <LogicalDeviceId>1FRO0700023971</LogicalDeviceId>
    <Measurement>
        <OBIS>1-0:1.8.0*255</OBIS>
        <CapturePeriod>15m</CapturePeriod>
        <Entry>
            <Timestamp>2020-06-26T14:15:00+02:00</Timestamp>
            <Value>978777</Value>
            <Scaler>-1</Scaler>
            <Unit>Wh</Unit>
            <Status>1</Status>
        </Entry>
    </Measurement>
    <RawData>3C3F786D6C2076...</RawData>
</ns2:ForwardMeterData>
```

#### Mandatory fields:
- TimeSent
- InstanceId
- TenantId
- MeterOperatorId
- Entry:Timestamp
- Entry:Value

#### JSON
```json
{
    "pk": "9cbf4f8a-f78a-4f21-bd4b-a8639e830a83",
    "smgwId": "EDNT0018068446",
    "logicalDeviceId": "1FRO0700023971",
    "rawData": "3C3F786D6C2076...",
    "messageId": "RSS",
    "correlationId": null,
    "timeSent": "2020-06-26T14:15:49.933+02:00",
    "instanceId": "MDCS_001",
    "tenantId": "1000",
    "meterOperatorId": "9903916000000",
    "externalMarketParticipantId": "9903916000000",
    "routingKeyServiceBus": "WIRCON",
    "routingKeyExtern": null,
    "obis": "1-0:1.8.0*255",
    "capturePeriod": "15m",
    "entryTimestamp": "2020-06-26T14:15:00+02:00",
    "entryValue": "978777",
    "entryScaler": -1,
    "entryUnit": "Wh",
    "entryStatus": "1"
}
```

#### Mandatory fields:
- timeSent
- instanceId
- tenantId
- meterOperatorId
- entryTimestamp
- entryValue

### User

#### JSON
```json
{
    "pk": "3e57e5c4-4a1e-4213-bac4-f78d3d794593",
    "name": "oli",
    "password" "secure-password",
    "company": null,
    "createdAt": "2020-06-26T15:28:30.510Z",
    "email": null,
    "isAdmin": true
}
```

#### Mandatory fields:
- name
- password

## Tests

Tests and example usage scenarios can be performed by the postman collection under [resources/oli-webservice.postman_collection.json](resources/oli-webservice.postman_collection.json). To use the postman collection an environment must be created which contains the following variables:
- apiUrl
- adminUser
- adminPassword
- user
- password