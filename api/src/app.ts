
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: __dirname + '/../.env' });
}

import { logger } from './logger';
import 'reflect-metadata';
import express = require('express');
import morgan = require('morgan');
import bodyParser = require('body-parser');
import { config } from './config'
import { connectDb } from './connect-db';
import { userRouter, meterDataRouter, meterDataRouterSoap } from './route';
import { errorResponses } from './assets';

const convert = require('xml-js');
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

        // Body parsers
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        // Meter data route: SOAP
        app.use('/cb-emt-meterData/soap/v1/meterDataCollectionOut', meterDataRouterSoap);

        // Meter data route: REST
        app.use('/cb-emt-meterData/rest/v1/meterDataCollectionOut', meterDataRouter);
        
        // User route: REST
        app.use('/cb-emt-meterData/rest/v1/users', userRouter);
        
        // Errors
        app.use((error: any, req: any, res: any, _next: any) => {

            let errorRes = errorResponses.internal;
            res.send(convert.json2xml(errorRes, {compact: true, ignoreComment: true, spaces: 4}))
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
