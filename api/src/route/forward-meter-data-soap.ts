
import express = require('express');
import bodyParser = require('body-parser');
import { Request, Response } from 'express';
import { postMeterData } from '../controller';
import { dbConnection } from '../app';
import { isAuthorizedUser } from '../auth';
import { errorResponses } from '../assets';
import { config } from '../config';

const convert = require('xml-js');

export var meterDataRouterSoap = express.Router();


meterDataRouterSoap.post('/', bodyParser.raw({ type: function () { return true; }, limit: '5mb' }), async function (req: Request, res: Response) {
    
    let isAuthorized = await isAuthorizedUser(dbConnection, req.headers);
    res.type('application/xml');
    
    if (isAuthorized) {
        let postMeterDataRes: any = await postMeterData(dbConnection, req.body);
        if (postMeterDataRes.data !== undefined) {
            res.status(postMeterDataRes.status).send(req.body);
        } else if (postMeterDataRes.error) {
            res.status(postMeterDataRes.status).send(convert.json2xml(postMeterDataRes.error, config.xmlOptions));
        } else {
            res.status(500).send(convert.json2xml(errorResponses.unauthorized, config.xmlOptions));
        }
    } else {
        res.status(401).send(convert.json2xml(errorResponses.unauthorized, config.xmlOptions));
    }
});

