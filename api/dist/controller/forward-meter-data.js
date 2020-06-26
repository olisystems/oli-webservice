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
        let jsonData;
        let messageHeaderRepository = dbConnection.getRepository(entity_1.MessageHeader);
        let measurementRepository = dbConnection.getRepository(entity_1.Measurement);
        let meterDataRepository = dbConnection.getRepository(entity_1.MeterData);
        let postMessageHeader;
        let postMeasurement;
        let postMeterData;
        let messageHeader;
        let measurement;
        let meterData;
        let smgwId;
        let logicalDeviceId;
        let rawData;
        let forwardMeterData;
        let badRequest;
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                jsonData = convert.xml2js(xmlData, { compact: false, spaces: 4 });
                badRequest = validateRequestBody(jsonData);
                if (badRequest !== undefined) {
                    resolve({
                        status: 400,
                        error: { message: 'Bad request', error: badRequest }
                    });
                }
                else {
                    forwardMeterData = getObjectByName(jsonData.elements, 'ns2:ForwardMeterData')[0].elements;
                }
                meterData = {};
                messageHeader = constructMessageHeader(getObjectByName(forwardMeterData, 'MessageHeader')[0].elements);
                measurement = constructMeasurement(getObjectByName(forwardMeterData, 'Measurement')[0].elements);
                smgwId = getObjectByName(forwardMeterData, 'SmgwId')[0].elements[0].text;
                if (getObjectByName(forwardMeterData, 'LogicalDeviceId').length > 0) {
                    logicalDeviceId = getObjectByName(forwardMeterData, 'LogicalDeviceId')[0].elements[0].text;
                }
                if (getObjectByName(forwardMeterData, 'RawData').length > 0) {
                    rawData = getObjectByName(forwardMeterData, 'RawData')[0].elements[0].text;
                }
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
    messageHeader.timeSent = getObjectByName(data, 'TimeSent')[0].elements[0].text;
    messageHeader.instanceId = getObjectByName(data, 'InstanceId')[0].elements[0].text;
    messageHeader.tenantId = getObjectByName(data, 'TenantId')[0].elements[0].text;
    messageHeader.meterOperatorId = getObjectByName(data, 'MeterOperatorId')[0].elements[0].text;
    if (getObjectByName(data, 'MessageId').length > 0) {
        messageHeader.messageId = getObjectByName(data, 'MessageId')[0].attributes.systemName;
    }
    if (getObjectByName(data, 'CorrelationId').length > 0) {
        messageHeader.correlationId = getObjectByName(data, 'CorrelationId')[0].elements[0].text;
    }
    if (getObjectByName(data, 'ExternalMarketParticipantId').length > 0) {
        messageHeader.externalMarketParticipantId = getObjectByName(data, 'ExternalMarketParticipantId')[0].elements[0].text;
    }
    if (getObjectByName(data, 'RoutingKeyServiceBus').length > 0) {
        messageHeader.routingKeyServiceBus = getObjectByName(data, 'RoutingKeyServiceBus')[0].elements[0].text;
    }
    if (getObjectByName(data, 'RoutingKeyExtern').length > 0) {
        messageHeader.routingKeyExtern = getObjectByName(data, 'RoutingKeyExtern')[0].elements[0].text;
    }
    return messageHeader;
}
function constructMeasurement(data) {
    let measurement = {};
    let entry = getObjectByName(data, 'Entry')[0].elements;
    measurement.pk = uuid_1.v4();
    measurement.entryTimestamp = getObjectByName(entry, 'Timestamp')[0].elements[0].text;
    measurement.entryValue = getObjectByName(entry, 'Value')[0].elements[0].text;
    if (getObjectByName(data, 'OBIS').length > 0) {
        measurement.obis = getObjectByName(data, 'OBIS')[0].elements[0].text;
    }
    if (getObjectByName(data, 'CapturePeriod').length > 0) {
        measurement.capturePeriod = getObjectByName(data, 'CapturePeriod')[0].elements[0].text;
    }
    if (getObjectByName(entry, 'Scaler').length > 0) {
        measurement.entryScaler = getObjectByName(entry, 'Scaler')[0].elements[0].text;
    }
    if (getObjectByName(entry, 'Unit').length > 0) {
        measurement.entryUnit = getObjectByName(entry, 'Unit')[0].elements[0].text;
    }
    if (getObjectByName(entry, 'Status').length > 0) {
        measurement.entryStatus = getObjectByName(entry, 'Status')[0].elements[0].text;
    }
    return measurement;
}
function validateRequestBody(body) {
    let forwardMeterData;
    let messageHeader;
    let measurement;
    let entry;
    if (getObjectByName(body.elements, 'ns2:ForwardMeterData').length === 0) {
        return { name: 'Missing field', field: 'ns2:ForwardMeterData' };
    }
    else {
        forwardMeterData = getObjectByName(body.elements, 'ns2:ForwardMeterData')[0].elements;
    }
    if (getObjectByName(forwardMeterData, 'SmgwId').length === 0) {
        return { name: 'Missing field', field: 'SmgwId' };
    }
    if (getObjectByName(forwardMeterData, 'MessageHeader').length === 0) {
        return { name: 'Missing field', field: 'MessageHeader' };
    }
    else {
        messageHeader = getObjectByName(forwardMeterData, 'MessageHeader')[0].elements;
    }
    if (getObjectByName(messageHeader, 'TimeSent').length === 0) {
        return { name: 'Missing field', field: 'TimeSent' };
    }
    if (getObjectByName(messageHeader, 'InstanceId').length === 0) {
        return { name: 'Missing field', field: 'InstanceId' };
    }
    if (getObjectByName(messageHeader, 'TenantId').length === 0) {
        return { name: 'Missing field', field: 'TenantId' };
    }
    if (getObjectByName(messageHeader, 'MeterOperatorId').length === 0) {
        return { name: 'Missing field', field: 'MeterOperatorId' };
    }
    if (getObjectByName(forwardMeterData, 'Measurement').length === 0) {
        return { name: 'Missing field', field: 'Measurement' };
    }
    else {
        measurement = getObjectByName(forwardMeterData, 'Measurement')[0].elements;
    }
    if (getObjectByName(measurement, 'Entry').length === 0) {
        return { name: 'Missing field', field: 'Entry' };
    }
    else {
        entry = getObjectByName(measurement, 'Entry')[0].elements;
    }
    if (getObjectByName(entry, 'Timestamp').length === 0) {
        return { name: 'Missing field', field: 'Timestamp' };
    }
    if (getObjectByName(entry, 'Value').length === 0) {
        return { name: 'Missing field', field: 'Timestamp' };
    }
    return undefined;
}
function getObjectByName(elementArray, elementName) {
    return elementArray.filter((obj) => {
        return obj.name === elementName;
    });
}
//# sourceMappingURL=forward-meter-data.js.map