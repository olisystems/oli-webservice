"use strict";
exports.__esModule = true;
exports.config = void 0;
exports.config = {
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
        retries: 10,
        retryTimeout: 5000 // 5000 milli seconds
    },
    xmlOptions: { compact: true, ignoreComment: true, spaces: 4 },
    mqtt: {
        connection: {
            url: "unbelievable-politician.cloudmqtt.com",
            port: 1883,
            username: "gmnzhypg",
            password: "zEb0WyhKguIn"
        }
    }
};
