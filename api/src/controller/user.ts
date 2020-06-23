import { v4 as uuid } from 'uuid';
import bcrypt = require('bcrypt');
import { User } from '../entity';
import { IUser } from '../model';
import { logger } from '../logger';

const saltRounds = 10;



/**
 * Get all users
 * @param {any} dbConnection typeorm connection object
 */
export async function getUsers(dbConnection: any) {

    let userRepository = dbConnection.getRepository(User);
    
    return new Promise (async (resolve) => {

        try {
            let getUsers = await userRepository.find({
                select: ["pk", "name", "company", "createdAt", "email", "isAdmin"],
                order: {
                    name: "DESC"
                }
            });
            resolve({
                status: 200,
                data: getUsers
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


/**
 * Get a user by its primary key
 * @param {any} dbConnection typeorm connection object
 * @param {string} pk primary key of user
 */
export async function getUserByPk(dbConnection: any, pk: string) {

    let userRepository = dbConnection.getRepository(User);
    
    return new Promise (async (resolve) => {

        try {
            let getUsers = await userRepository.find({
                select: ["pk", "name", "company", "createdAt", "email", "isAdmin"],
                where: { pk: pk } 
            });
            resolve({
                status: 200,
                data: getUsers
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


/**
 * Post a user into the database
 * @param {any} dbConnection typeorm connection object
 * @param {any} data request body as plain xml
 */
export async function postUser(dbConnection: any, data: any) {

    let userRepository = dbConnection.getRepository(User);
    let postUser: IUser = {};      
    
    postUser.pk = uuid();
    postUser.name = data.name;
    postUser.password = await bcrypt.hash(data.password, saltRounds);
    postUser.company = data.company;
    postUser.email = data.email;

    return new Promise (async (resolve) => {

        try {
            let postUserData = await userRepository.save(postUser);
            resolve({
                status: 201,
                data: postUserData
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


/**
 * Update user in database
 * @param {any} dbConnection typeorm connection object
 * @param {any} data request body as plain xml
 * @param {string} pk primary key of user
 */
export async function patchUser(dbConnection: any, data: any, pk: string) {

    let userRepository = dbConnection.getRepository(User);
    let patchUser = await userRepository.find({ where: { pk: pk } });

    patchUser[0].name = data.name;
    patchUser[0].password = await bcrypt.hash(data.password, saltRounds);
    patchUser[0].company = data.company;
    patchUser[0].email = data.email;

    return new Promise (async (resolve) => {

        try {
            let patchUserData = await userRepository.save(patchUser);
            resolve({
                status: 200,
                data: patchUserData
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


/**
 * Delete a user by its primary key
 * @param {any} dbConnection typeorm connection object
 * @param {string} pk primary key of user
 */
export async function deleteUser(dbConnection: any, pk: string) {

    let userRepository = dbConnection.getRepository(User);
    let deleteUser = await userRepository.find({ where: { pk: pk } });

    return new Promise (async (resolve) => {

        try {
            let deleteUserData = await userRepository.remove(deleteUser);
            resolve({
                status: 200,
                data: {"message": "User deleted"}
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
