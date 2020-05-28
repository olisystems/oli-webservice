if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: __dirname + '/../.env' });
}

import 'reflect-metadata';
import express = require('express');
import { Request, Response } from "express";
const ipfilter = require('express-ipfilter').IpFilter
import morgan = require('morgan');
import bodyParser = require('body-parser');
import compression = require('compression');
import { config } from './config'
import { logger } from './logger';
import { connectDb } from './connect-db';
import { postMeterData } from './controller';
import { initKeycloak } from './setup-keycloak';
const keycloak: any = initKeycloak();
const port = process.env.SERVER_PORT

export const app: express.Application = express();
export var dbConnection: any;


// Start app
const startApp = async () => {

    // Log mode
    if (process.env.NODE_ENV === 'production') {
        logger.info('in production mode');
    } else {
        logger.info('in develop mode');
    }

    // Connact to database
    dbConnection = await connectDb();
    if (dbConnection) {

        logger.info(`successfully connected to ${config.db.connection.type}`);
        

        // Develop log
        if (process.env.NODE_ENV !== 'production') {
            app.use(morgan('dev'));
        }

        // IP filter
        // TODO: uncommend
        // app.use(ipfilter(config.ipWhitelist, { mode: 'allow' }))

        // Body parser
        app.use(bodyParser.raw({ type: function () { return true; }, limit: '5mb' }));

        // Keycloak middleware
        app.use(keycloak.middleware());
        
        // Routes
        app.post('/cb-emt-meterData/soap/v1/meterDataCollectionOut', keycloak.protect(), async function (req: Request, res: Response) {

            let postMeterDataRes: any = await postMeterData(dbConnection, req.body);
            res.status(postMeterDataRes.status).send(req.body);
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
