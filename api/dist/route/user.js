"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express = require("express");
const controller_1 = require("../controller");
const app_1 = require("../app");
const auth_1 = require("../auth");
exports.userRouter = express.Router();
exports.userRouter.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let isAuthorized = yield auth_1.isAuthorizedAdmin(app_1.dbConnection, req.headers);
        if (isAuthorized) {
            let postUserRes = yield controller_1.getUsers(app_1.dbConnection);
            res.status(postUserRes.status).json(postUserRes.data);
        }
        else {
            res.status(401).json({ "message": "Unauthorized" });
        }
    });
});
exports.userRouter.get('/:pk', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let isAuthorized = yield auth_1.isAuthorizedAdmin(app_1.dbConnection, req.headers);
        if (isAuthorized) {
            let postUserRes = yield controller_1.getUserByPk(app_1.dbConnection, req.params.pk);
            res.status(postUserRes.status).json(postUserRes.data);
        }
        else {
            res.status(401).json({ "message": "Unauthorized" });
        }
    });
});
exports.userRouter.post('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let isAuthorized = yield auth_1.isAuthorizedAdmin(app_1.dbConnection, req.headers);
        if (isAuthorized) {
            let postUserRes = yield controller_1.postUser(app_1.dbConnection, req.body);
            res.status(postUserRes.status).json(postUserRes.data);
        }
        else {
            res.status(401).json({ "message": "Unauthorized" });
        }
    });
});
exports.userRouter.patch('/:pk', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let isAuthorized = yield auth_1.isAuthorizedAdmin(app_1.dbConnection, req.headers);
        if (isAuthorized) {
            let postUserRes = yield controller_1.patchUser(app_1.dbConnection, req.body, req.params.pk);
            res.status(postUserRes.status).json(postUserRes.data);
        }
        else {
            res.status(401).json({ "message": "Unauthorized" });
        }
    });
});
exports.userRouter.delete('/:pk', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let isAuthorized = yield auth_1.isAuthorizedAdmin(app_1.dbConnection, req.headers);
        if (isAuthorized) {
            let postUserRes = yield controller_1.deleteUser(app_1.dbConnection, req.params.pk);
            res.status(postUserRes.status).json(postUserRes.data);
        }
        else {
            res.status(401).json({ "message": "Unauthorized" });
        }
    });
});
//# sourceMappingURL=user.js.map