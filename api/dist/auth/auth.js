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
exports.isAuthorizedAdmin = exports.isAuthorizedUser = void 0;
const bcrypt = require("bcrypt");
const entity_1 = require("../entity");
const logger_1 = require("../logger");
const encodeBase64 = require('nodejs-base64-encode');
function isAuthorizedUser(dbConnection, reqHeader) {
    return __awaiter(this, void 0, void 0, function* () {
        let userRepository = dbConnection.getRepository(entity_1.User);
        let authStringDecoded;
        let nameReq;
        let passwordReq;
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (!reqHeader.authorization) {
                resolve(false);
            }
            else {
                authStringDecoded = encodeBase64.decode(reqHeader.authorization.split(' ')[1], 'base64');
                nameReq = authStringDecoded.split(':')[0];
                passwordReq = authStringDecoded.split(':')[1];
            }
            try {
                let getUser = yield userRepository.find({
                    select: ["name", "password"],
                    where: { name: nameReq }
                });
                let passwordIsEqual = yield bcrypt.compare(passwordReq, getUser[0].password);
                if (passwordIsEqual) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }
            catch (error) {
                logger_1.logger.error(error);
                resolve(false);
            }
        }));
    });
}
exports.isAuthorizedUser = isAuthorizedUser;
function isAuthorizedAdmin(dbConnection, reqHeader) {
    return __awaiter(this, void 0, void 0, function* () {
        let userRepository = dbConnection.getRepository(entity_1.User);
        let authStringDecoded;
        let nameReq;
        let passwordReq;
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (!reqHeader.authorization) {
                resolve(false);
            }
            else {
                authStringDecoded = encodeBase64.decode(reqHeader.authorization.split(' ')[1], 'base64');
                nameReq = authStringDecoded.split(':')[0];
                passwordReq = authStringDecoded.split(':')[1];
            }
            try {
                let getUser = yield userRepository.find({
                    select: ["name", "password"],
                    where: { name: nameReq, isAdmin: true }
                });
                let passwordIsEqual = yield bcrypt.compare(passwordReq, getUser[0].password);
                if (passwordIsEqual) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            }
            catch (error) {
                logger_1.logger.error(error);
                resolve(false);
            }
        }));
    });
}
exports.isAuthorizedAdmin = isAuthorizedAdmin;
//# sourceMappingURL=auth.js.map