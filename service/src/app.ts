if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: __dirname + '/../.env' });
}

import 'reflect-metadata';
import express = require('express');
import { Request, Response } from "express";
import morgan = require('morgan');
import bodyParser = require('body-parser');
import compression = require('compression');
import { config } from './config'
import { logger } from './logger';
import { connectDb } from './connect-db';
import { postMeterData } from './controller';

const port = process.env.SERVER_PORT
const xml = require('fs').readFileSync(__dirname + '/../resources/wsdl/MeterDataCollectionOut.svc.wsdl', 'utf8');

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


        // Environment
        app.get('env');


        // Develop log
        if (process.env.NODE_ENV !== 'production') {
            app.use(morgan('dev'));
        }

        // Body parser
        app.use(bodyParser.raw({ type: function () { return true; }, limit: '5mb' }));


        // Routes
        app.post('/soap', async function (req: Request, res: Response) {
            
            let postMeterDataRes: any = await postMeterData(dbConnection, req.body);
            res.status(postMeterDataRes.status).send(req.body);
        });
        

        // Errors
        app.use((req, res) => {

            const error = new Error('Not found');
            res.status(404).json({
                error: {
                    message: error.message
                }
            });
        });

        // http server
        app.listen(port, function () {
            logger.info(`server is running on port: ${port}`);
        });

    } else {
        logger.info(`failed to connect to ${config.db.connection.type}`)
    }
}
startApp();
