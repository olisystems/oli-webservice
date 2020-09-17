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
exports.meterDataRouter = void 0;
const express = require("express");
const controller_1 = require("../controller");
const app_1 = require("../app");
const auth_1 = require("../auth");
const assets_1 = require("../assets");
exports.meterDataRouter = express.Router();
exports.meterDataRouter.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let isAuthorized = yield auth_1.isAuthorizedAdmin(app_1.dbConnection, req.headers);
        if (isAuthorized) {
            let getMeterDataRes = yield controller_1.getMeterData(app_1.dbConnection, req);
            res.status(getMeterDataRes.status).send(getMeterDataRes.data);
        }
        else {
            res.status(401).send(assets_1.errorResponses.unauthorized);
        }
    });
});
//# sourceMappingURL=forward-meter-data.js.map