
export const config = {
    db: {
        connection: {
            type: 'postgres',
            host: process.env.PG_HOST,
            port: process.env.PG_PORT,
            username: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DATABASE,
            entities: [
                __dirname + '/entity/*.ts',
                __dirname + '/entity/*.js'
            ],
            synchronize: false,
            logging: false
        },
        retries: 5,
        retryTimeout: 5000   // 5000 milli seconds
    },
    keycloak: {
        dev: {
            "realm": "oli-webservice",
            "bearer-only": true,
            "auth-server-url": `${process.env.KC_HOST}`,
            "ssl-required": "NONE",
            "resource": "api",
            "confidential-port": 0
        },
        prod: {
            "realm": "oli-webservice",
            "bearer-only": true,
            "auth-server-url": `${process.env.KC_HOST}`,
            "ssl-required": "NONE",
            "resource": "api",
            "confidential-port": 0
        }
    },
    ipWhitelist: [`${process.env.CLIENT_IP_NET}`, '::1', '::/0']
}
