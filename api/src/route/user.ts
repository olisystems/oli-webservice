
import express = require('express');
import { Request, Response } from 'express';
import { getUsers, getUserByPk, postUser, patchUser, deleteUser } from '../controller';
import { dbConnection } from '../app';
import { isAuthorizedAdmin } from '../auth';

export var userRouter = express.Router();


userRouter.get('/users', async function(req: Request, res: Response){
      
    let isAuthorized = await isAuthorizedAdmin(dbConnection, req.headers);
    if (isAuthorized) {
        let postUserRes: any = await getUsers(dbConnection);
        res.status(postUserRes.status).json(postUserRes.data);
    } else {
        res.status(401).json({"message": "Unauthorized"});
    }
});

userRouter.get('/users/:pk', async function(req: Request, res: Response){
    
    let isAuthorized = await isAuthorizedAdmin(dbConnection, req.headers);
    if (isAuthorized) {
        let postUserRes: any = await getUserByPk(dbConnection, req.params.pk);
        res.status(postUserRes.status).json(postUserRes.data);
    } else {
        res.status(401).json({"message": "Unauthorized"});
    }
});

userRouter.post('/users', async function(req: Request, res: Response){
    
    let isAuthorized = await isAuthorizedAdmin(dbConnection, req.headers);
    if (isAuthorized) {
        let postUserRes: any = await postUser(dbConnection, req.body);
        res.status(postUserRes.status).json(postUserRes.data);
    } else {
        res.status(401).json({"message": "Unauthorized"});
    }
});

userRouter.patch('/users/:pk', async function(req: Request, res: Response){
    
    let isAuthorized = await isAuthorizedAdmin(dbConnection, req.headers);
    if (isAuthorized) {
        let postUserRes: any = await patchUser(dbConnection, req.body, req.params.pk);
        res.status(postUserRes.status).json(postUserRes.data);
    } else {
        res.status(401).json({"message": "Unauthorized"});
    }
});

userRouter.delete('/users/:pk', async function(req: Request, res: Response){
    
    let isAuthorized = await isAuthorizedAdmin(dbConnection, req.headers);
    if (isAuthorized) {
        let postUserRes: any = await deleteUser(dbConnection, req.params.pk);
        res.status(postUserRes.status).json(postUserRes.data);
    } else {
        res.status(401).json({"message": "Unauthorized"});
    }
});
