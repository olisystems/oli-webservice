import bcrypt = require('bcrypt');
import { User } from '../entity';
import { logger } from '../logger';

const encodeBase64 = require('nodejs-base64-encode');


/**
 * Comes the request from an authorized user 
 * @param {any} dbConnection typeorm connection object
 * @param {any} reqHeader http request header
 */
export async function isAuthorizedUser(dbConnection: any, reqHeader: any) {

    let userRepository = dbConnection.getRepository(User);    
    let authStringDecoded: string;
    let nameReq: string;
    let passwordReq: string;
    
    return new Promise (async (resolve) => {

        if (!reqHeader.authorization) {
            
            resolve(false);
        } else {
            
            authStringDecoded = encodeBase64.decode(reqHeader.authorization.split(' ')[1], 'base64');
            nameReq  = authStringDecoded.split(':')[0];
            passwordReq = authStringDecoded.split(':')[1];
        }

        try {
            
            let getUser = await userRepository.find({
                select: ["name", "password"],
                where: { name: nameReq } 
            });
            let passwordIsEqual = await bcrypt.compare(passwordReq, getUser[0].password);

            if (passwordIsEqual) {
                resolve(true);
            } else {
                resolve(false);
            }

        } catch (error) {
            
            logger.error(error);
            resolve(false)
        }
    })
}


/**
 * Comes the request from an authorized admin 
 * @param {any} dbConnection typeorm connection object
 * @param {any} reqHeader http request header
 */
export async function isAuthorizedAdmin(dbConnection: any, reqHeader: any) {

    let userRepository = dbConnection.getRepository(User);    
    let authStringDecoded: string;
    let nameReq: string;
    let passwordReq: string;
    
    return new Promise (async (resolve) => {

        if (!reqHeader.authorization) {
            resolve(false);
        } else {

            authStringDecoded = encodeBase64.decode(reqHeader.authorization.split(' ')[1], 'base64');
            nameReq  = authStringDecoded.split(':')[0];
            passwordReq = authStringDecoded.split(':')[1];
        }

        try {

            let getUser = await userRepository.find({
                select: ["name", "password"],
                where: { name: nameReq, isAdmin: true } 
            });

            let passwordIsEqual = await bcrypt.compare(passwordReq, getUser[0].password);

            if (passwordIsEqual) {
                resolve(true);
            } else {
                resolve(false);
            }

        } catch (error) {
            logger.error(error);
            resolve(false)
        }
    })
}