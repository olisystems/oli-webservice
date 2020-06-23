
import express = require('express');
import bodyParser = require('body-parser');
import { Request, Response } from 'express';
import { postMeterData } from '../controller';
import { dbConnection } from '../app';
import { isAuthorizedUser } from '../auth';

export var meterDataRouter = express.Router();


meterDataRouter.post('/cb-emt-meterData/soap/v1/meterDataCollectionOut', bodyParser.raw({ type: function () { return true; }, limit: '5mb' }), async function (req: Request, res: Response) {
    
    let isAuthorized = await isAuthorizedUser(dbConnection, req.headers);
    if (isAuthorized) {
        let postMeterDataRes: any = await postMeterData(dbConnection, req.body);
        res.status(postMeterDataRes.status).send(req.body);
    } else {
        res.status(401).json({"message": "Unauthorized"});
    }
});
