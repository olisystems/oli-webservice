
import { Request } from 'express';
import { MoreThan, LessThan, Between } from "typeorm";
import { logger } from '../logger';
import { MeterDataSet } from '../entity';


/**
 * Get meter data
 * @param {any} dbConnection typeorm connection object
 */
export async function getMeterData(dbConnection: any, req: Request) {

    let meterdDataRepository = dbConnection.getRepository(MeterDataSet);
    let whereClause: any = {};
    
    // Set filter

    // smgwId
    if (req.query.smgwId) {
        console.log('in smgwId');
        whereClause.smgwId = req.query.smgwId;
    }

    // start date and end date
    if (req.query.startDate && req.query.endDate) {
        console.log('in Between');
        whereClause.entryTimestamp = Between(req.query.startDate, req.query.endDate);
    }

    // start date
    if (req.query.startDate && !req.query.endDate) {
        console.log('in Start');
        whereClause.entryTimestamp = MoreThan(req.query.startDate);
        
    }

    // end date
    if (!req.query.startDate && req.query.endDate) {
        console.log('in End');
        whereClause.entryTimestamp = LessThan(req.query.endDate);
    }

    return new Promise (async (resolve) => {

        try {
            let getMeterData = await meterdDataRepository.find({
                order: {
                    timeSent: "DESC"
                },
                where: whereClause,
            });
            resolve({
                status: 200,
                data: getMeterData
            })
        } catch (error) {
            logger.error(error);
            resolve({
                status: 500,
                data: { error: error }
            })
        }
    })
}