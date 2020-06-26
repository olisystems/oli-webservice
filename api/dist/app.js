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
exports.dbConnection = exports.app = void 0;
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: __dirname + '/../.env' });
}
const logger_1 = require("./logger");
require("reflect-metadata");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const config_1 = require("./config");
const connect_db_1 = require("./connect-db");
const route_1 = require("./route");
const assets_1 = require("./assets");
const convert = require('xml-js');
const port = process.env.SERVER_PORT;
exports.app = express();
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === 'production') {
        logger_1.logger.info('service is running in production mode');
    }
    else {
        logger_1.logger.info('service is running in develop mode');
    }
    exports.dbConnection = yield connect_db_1.connectDb();
    if (exports.dbConnection) {
        logger_1.logger.info(`successfully connected to ${config_1.config.db.connection.type}`);
        if (process.env.NODE_ENV !== 'production') {
            exports.app.use(morgan('dev'));
        }
        exports.app.use(bodyParser.urlencoded({ extended: true }));
        exports.app.use(bodyParser.json());
        exports.app.use('/cb-emt-meterData/soap/v1/meterDataCollectionOut', route_1.meterDataRouterSoap);
        exports.app.use('/cb-emt-meterData/rest/v1/users', route_1.userRouter);
        exports.app.use((error, req, res, _next) => {
            let errorRes = assets_1.errorResponses.internal;
            res.send(convert.json2xml(errorRes, { compact: true, ignoreComment: true, spaces: 4 }));
        });
        exports.app.listen(port, function () {
            logger_1.logger.info(`server is running on port: ${port}`);
        });
    }
    else {
        logger_1.logger.error(`failed to connect to ${config_1.config.db.connection.type}`);
    }
});
startApp();
//# sourceMappingURL=app.js.map