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
exports.connectDb = void 0;
const config_1 = require("./config");
const logger_1 = require("./logger");
const typeorm_1 = require("typeorm");
const connectionOptions = config_1.config.db.connection;
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        let retries = config_1.config.db.retries;
        let dbConnection;
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            while (retries) {
                try {
                    dbConnection = yield typeorm_1.createConnection(connectionOptions);
                    resolve(dbConnection);
                    break;
                }
                catch (error) {
                    retries -= 1;
                    logger_1.logger.error(error);
                    logger_1.logger.error(`retries left: ${retries}`);
                    yield new Promise(res => setTimeout(res, config_1.config.db.retryTimeout));
                }
            }
            resolve(false);
        }));
    });
}
exports.connectDb = connectDb;
;
//# sourceMappingURL=connect-db.js.map