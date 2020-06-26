
import { logger } from '../logger';
import { MeterDataSet } from '../entity';


/**
 * Get meter data
 * @param {any} dbConnection typeorm connection object
 */
export async function getMeterData(dbConnection: any) {

    let meterdDataRepository = dbConnection.getRepository(MeterDataSet);
    
    return new Promise (async (resolve) => {

        try {
            let getMeterData = await meterdDataRepository.find({
                order: {
                    timeSent: "DESC"
                },
                limit: 30
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