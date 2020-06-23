
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: __dirname + '/../.env' });
}

import { logger } from './logger';
import 'reflect-metadata';
import fs = require('fs');
import express = require('express');
import https = require('https');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import { config } from './config'
import { connectDb } from './connect-db';
import { userRouter, meterDataRouter } from './route';

const ipfilter = require('express-ipfilter').IpFilter;
const port = process.env.SERVER_PORT;

export const app: express.Application = express();
export var dbConnection: any;


// Start app
const startApp = async () => {

    // Log mode
    if (process.env.NODE_ENV === 'production') {
        logger.info('service is running in production mode');
    } else {
        logger.info('service is running in develop mode');
    }

    // Connact to database
    dbConnection = await connectDb();
    if (dbConnection) {

        logger.info(`successfully connected to ${config.db.connection.type}`);

        // Develop log
        if (process.env.NODE_ENV !== 'production') {
            app.use(morgan('dev'));
        }

        // IP Filter
        // TODO: uncoment
        // app.use(ipfilter(config.ipWhitelist, { mode: 'allow' }))

        // Body parsers
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        // Meter data routes
        app.use('/', meterDataRouter);
        
        // User routes
        app.use('/users', userRouter);
        
        app.post('/test', function(req, res){
    
            res.status(200).json({"message": "test successfull"});
        });

        // Errors
        app.use((error: any, req: any, res: any, _next: any) => {

            let errorRes: object = {};

            if (error.name === 'IpDeniedError') {

                logger.error(error);
                res.status(error.status);
                errorRes = {
                    message: 'Access denied',
                    error: error
                }
            }

            res.json(errorRes)
        });

        // http server
        app.listen(port, function () {
            logger.info(`server is running on port: ${port}`);
        });

    } else {
        logger.error(`failed to connect to ${config.db.connection.type}`)
    }
}
startApp();
