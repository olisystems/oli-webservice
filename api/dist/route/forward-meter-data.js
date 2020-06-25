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
const bodyParser = require("body-parser");
const controller_1 = require("../controller");
const app_1 = require("../app");
const auth_1 = require("../auth");
const assets_1 = require("../assets");
const config_1 = require("../config");
const convert = require('xml-js');
exports.meterDataRouter = express.Router();
exports.meterDataRouter.post('/', bodyParser.raw({ type: function () { return true; }, limit: '5mb' }), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let isAuthorized = yield auth_1.isAuthorizedUser(app_1.dbConnection, req.headers);
        res.type('application/xml');
        if (isAuthorized) {
            let postMeterDataRes = yield controller_1.postMeterData(app_1.dbConnection, req.body);
            if (postMeterDataRes.data !== undefined) {
                res.status(postMeterDataRes.status).send(req.body);
            }
            else if (postMeterDataRes.error) {
                res.status(postMeterDataRes.status).send(convert.json2xml(postMeterDataRes.error, config_1.config.xmlOptions));
            }
            else {
                res.status(500).send(convert.json2xml(assets_1.errorResponses.unauthorized, config_1.config.xmlOptions));
            }
        }
        else {
            res.status(401).send(convert.json2xml(assets_1.errorResponses.unauthorized, config_1.config.xmlOptions));
        }
    });
});
//# sourceMappingURL=forward-meter-data.js.map