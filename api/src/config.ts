
export const config = {
    db: {
        connection: {
            type: 'postgres',
            host: process.env.PG_HOST || 'localhost',
            port: 5432,
            username: process.env.PG_USER || 'postgres',
            password: process.env.PG_PASSWORD || 'password',
            database: process.env.PG_DATABASE || "postgres",
            entities: [
                __dirname + '/entity/*.ts',
                __dirname + '/entity/*.js'
            ],
            synchronize: false,
            logging: false
        },
        retries: 10,
        retryTimeout: 5000   // 5000 milli seconds
    },
    xmlOptions: {compact: true, ignoreComment: true, spaces: 4},
    mqtt: {
        connection: {
            url: process.env.MQTT_URL || 'unbelievable-politician.cloudmqtt.com',
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD
        }
    }
}
