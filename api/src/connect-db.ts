import { config } from './config';
import { logger } from './logger';
import { createConnection } from 'typeorm';

const connectionOptions: any = config.db.connection;


// Database connection loop 
export async function connectDb() {
    
    let retries = config.db.retries;
    let dbConnection;
    
    return new Promise ( async (resolve) => {
        
        while (retries) {

            try {
                dbConnection = await createConnection(connectionOptions);
                resolve(dbConnection)
                break;
            } catch (error) {
                retries -= 1;
                console.log(error)
                logger.error(`retries left: ${retries}`);
                await new Promise(res => setTimeout(res, config.db.retryTimeout));
            }
        }
        resolve(false)
    })
};
