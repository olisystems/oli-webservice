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
exports.deleteUser = exports.patchUser = exports.postUser = exports.getUserByPk = exports.getUsers = void 0;
const uuid_1 = require("uuid");
const bcrypt = require("bcrypt");
const entity_1 = require("../entity");
const logger_1 = require("../logger");
const saltRounds = 10;
function getUsers(dbConnection) {
    return __awaiter(this, void 0, void 0, function* () {
        let userRepository = dbConnection.getRepository(entity_1.User);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                let getUsers = yield userRepository.find({
                    select: ["pk", "name", "company", "createdAt", "email", "isAdmin"],
                    order: {
                        name: "DESC"
                    }
                });
                resolve({
                    status: 200,
                    data: getUsers
                });
            }
            catch (error) {
                logger_1.logger.error(error);
                resolve({
                    status: 500,
                    data: { error: error }
                });
            }
        }));
    });
}
exports.getUsers = getUsers;
function getUserByPk(dbConnection, pk) {
    return __awaiter(this, void 0, void 0, function* () {
        let userRepository = dbConnection.getRepository(entity_1.User);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                let getUsers = yield userRepository.find({
                    select: ["pk", "name", "company", "createdAt", "email", "isAdmin"],
                    where: { pk: pk }
                });
                resolve({
                    status: 200,
                    data: getUsers
                });
            }
            catch (error) {
                logger_1.logger.error(error);
                resolve({
                    status: 500,
                    data: { error: error }
                });
            }
        }));
    });
}
exports.getUserByPk = getUserByPk;
function postUser(dbConnection, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let userRepository = dbConnection.getRepository(entity_1.User);
        let postUser = {};
        postUser.pk = uuid_1.v4();
        postUser.name = data.name;
        postUser.password = yield bcrypt.hash(data.password, saltRounds);
        postUser.company = data.company;
        postUser.email = data.email;
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                let postUserData = yield userRepository.save(postUser);
                resolve({
                    status: 201,
                    data: postUserData
                });
            }
            catch (error) {
                logger_1.logger.error(error);
                resolve({
                    status: 500,
                    data: { error: error }
                });
            }
        }));
    });
}
exports.postUser = postUser;
function patchUser(dbConnection, data, pk) {
    return __awaiter(this, void 0, void 0, function* () {
        let userRepository = dbConnection.getRepository(entity_1.User);
        let patchUser = yield userRepository.find({ where: { pk: pk } });
        patchUser[0].name = data.name;
        patchUser[0].password = yield bcrypt.hash(data.password, saltRounds);
        patchUser[0].company = data.company;
        patchUser[0].email = data.email;
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                let patchUserData = yield userRepository.save(patchUser);
                resolve({
                    status: 200,
                    data: patchUserData
                });
            }
            catch (error) {
                logger_1.logger.error(error);
                resolve({
                    status: 500,
                    data: { error: error }
                });
            }
        }));
    });
}
exports.patchUser = patchUser;
function deleteUser(dbConnection, pk) {
    return __awaiter(this, void 0, void 0, function* () {
        let userRepository = dbConnection.getRepository(entity_1.User);
        let deleteUser = yield userRepository.find({ where: { pk: pk } });
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                let deleteUserData = yield userRepository.remove(deleteUser);
                resolve({
                    status: 200,
                    data: { "message": "User deleted" }
                });
            }
            catch (error) {
                logger_1.logger.error(error);
                resolve({
                    status: 500,
                    data: { error: error }
                });
            }
        }));
    });
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.js.map