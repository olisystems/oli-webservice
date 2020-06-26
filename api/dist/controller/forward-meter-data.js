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
exports.getMeterData = void 0;
const logger_1 = require("../logger");
const entity_1 = require("../entity");
function getMeterData(dbConnection) {
    return __awaiter(this, void 0, void 0, function* () {
        let meterdDataRepository = dbConnection.getRepository(entity_1.MeterDataSet);
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                let getMeterData = yield meterdDataRepository.find({
                    order: {
                        timeSent: "DESC"
                    },
                    limit: 30
                });
                resolve({
                    status: 200,
                    data: getMeterData
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
exports.getMeterData = getMeterData;
//# sourceMappingURL=forward-meter-data.js.map