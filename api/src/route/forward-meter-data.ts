
import express = require('express');
import bodyParser = require('body-parser');
import xml = require('xml');
import { Request, Response } from 'express';
import { postMeterData } from '../controller';
import { dbConnection } from '../app';
import { isAuthorizedUser } from '../auth';

export var meterDataRouter = express.Router();


meterDataRouter.post('/', bodyParser.raw({ type: function () { return true; }, limit: '5mb' }), async function (req: Request, res: Response) {
    
    let isAuthorized = await isAuthorizedUser(dbConnection, req.headers);
    res.type('application/xml');
    
    if (isAuthorized) {
        let postMeterDataRes: any = await postMeterData(dbConnection, req.body);
        if (postMeterDataRes.data !== undefined) {
            res.status(postMeterDataRes.status).send(req.body);
        } else if (postMeterDataRes.error) {
            res.status(postMeterDataRes.status).send(xml(postMeterDataRes.error));
        } else {
            res.status(500).send(xml({"message": "Internal server error"}));    
        }
    } else {
        res.status(401).send(xml({"message": "Unauthorized"}));
    }
});
