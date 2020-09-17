
import express = require('express');
import { Request, Response } from 'express';
import { getMeterData } from '../controller';
import { dbConnection } from '../app';
import { isAuthorizedAdmin } from '../auth';
import { errorResponses } from '../assets';

export var meterDataRouter = express.Router();


meterDataRouter.get('/', async function (req: Request, res: Response) {

    let isAuthorized = await isAuthorizedAdmin(dbConnection, req.headers);
    if (isAuthorized) {
        let getMeterDataRes: any = await getMeterData(dbConnection, req);
        res.status(getMeterDataRes.status).send(getMeterDataRes.data);
    } else {
        res.status(401).send(errorResponses.unauthorized);
    }
});
