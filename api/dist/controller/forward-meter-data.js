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
exports.postMeterData = void 0;
const uuid_1 = require("uuid");
const entity_1 = require("../entity");
const logger_1 = require("../logger");
const assets_1 = require("../assets");
const convert = require('xml-js');
function postMeterData(dbConnection, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let xmlData = data;
        let messageHeaderRepository = dbConnection.getRepository(entity_1.MessageHeader);
        let measurementRepository = dbConnection.getRepository(entity_1.Measurement);
        let meterDataRepository = dbConnection.getRepository(entity_1.MeterData);
        let postMessageHeader;
        let postMeasurement;
        let postMeterData;
        let jsonData;
        let messageHeader;
        let measurement;
        let meterData;
        let smgwId;
        let logicalDeviceId;
        let rawData;
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                jsonData = convert.xml2js(xmlData, { compact: false, spaces: 4 });
                messageHeader = constructMessageHeader(jsonData.elements[0].elements[1].elements[0].elements[0].elements);
                measurement = constructMeasurement(jsonData.elements[0].elements[1].elements[0].elements[3].elements);
                meterData = {};
                smgwId = jsonData.elements[0].elements[1].elements[0].elements[1].elements[0].text;
                logicalDeviceId = jsonData.elements[0].elements[1].elements[0].elements[2].elements[0].text;
                rawData = jsonData.elements[0].elements[1].elements[0].elements[4].elements[0].text;
            }
            catch (error) {
                logger_1.logger.error(error);
                resolve({
                    status: 400,
                    error: assets_1.errorResponses.badRequest
                });
            }
            try {
                postMessageHeader = yield messageHeaderRepository.save(messageHeader);
            }
            catch (error) {
                logger_1.logger.error(error);
                resolve({
                    status: 500,
                    error: assets_1.errorResponses.internal
                });
            }
            try {
                postMeasurement = yield measurementRepository.save(measurement);
            }
            catch (error) {
                logger_1.logger.error(error);
                resolve({
                    status: 500,
                    error: assets_1.errorResponses.internal
                });
            }
            try {
                meterData.pk = uuid_1.v4();
                meterData.messageHeaderFK = messageHeader.pk;
                meterData.smgwId = smgwId;
                meterData.logicalDeviceId = logicalDeviceId;
                meterData.measurementFK = measurement.pk;
                meterData.rawData = rawData;
                postMeterData = yield meterDataRepository.save(meterData);
            }
            catch (error) {
                logger_1.logger.error(error);
                resolve({
                    status: 500,
                    error: assets_1.errorResponses.internal
                });
            }
            logger_1.logger.verbose("forward meterdata successfully performed");
            resolve({
                status: 201,
                data: postMessageHeader
            });
        }));
    });
}
exports.postMeterData = postMeterData;
function constructMessageHeader(data) {
    let messageHeader = {};
    messageHeader.pk = uuid_1.v4();
    messageHeader.messageId = getObjectByName(data, 'com:MessageId')[0].attributes.systemName;
    messageHeader.correlationId = getObjectByName(data, 'com:CorrelationId')[0].elements[0].text;
    messageHeader.timeSent = getObjectByName(data, 'com:TimeSent')[0].elements[0].text;
    messageHeader.instanceId = getObjectByName(data, 'com:InstanceId')[0].elements[0].text;
    messageHeader.tenantId = getObjectByName(data, 'com:TenantId')[0].elements[0].text;
    messageHeader.meterOperatorId = getObjectByName(data, 'com:MeterOperatorId')[0].elements[0].text;
    messageHeader.externalMarketParticipantId = getObjectByName(data, 'com:ExternalMarketParticipantId')[0].elements[0].text;
    messageHeader.routingKeyServiceBus = getObjectByName(data, 'com:RoutingKeyServiceBus')[0].elements[0].text;
    messageHeader.routingKeyExtern = getObjectByName(data, 'com:RoutingKeyExtern')[0].elements[0].text;
    return messageHeader;
}
function constructMeasurement(data) {
    let measurement = {};
    let entry = getObjectByName(data, 'met:Entry')[0].elements;
    measurement.pk = uuid_1.v4();
    measurement.obis = getObjectByName(data, 'met:OBIS')[0].elements[0].text;
    measurement.capturePeriod = getObjectByName(data, 'met:CapturePeriod')[0].elements[0].text;
    measurement.entryTimestamp = getObjectByName(entry, 'met:Timestamp')[0].elements[0].text;
    measurement.entryValue = getObjectByName(entry, 'met:Value')[0].elements[0].text;
    measurement.entryScaler = getObjectByName(entry, 'met:Scaler')[0].elements[0].text;
    measurement.entryUnit = getObjectByName(entry, 'met:Unit')[0].elements[0].text;
    measurement.entryStatus = getObjectByName(entry, 'met:Status')[0].elements[0].text;
    return measurement;
}
function getObjectByName(elementArray, elementName) {
    return elementArray.filter((obj) => {
        return obj.name === elementName;
    });
}
//# sourceMappingURL=forward-meter-data.js.map