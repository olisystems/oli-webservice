import { v4 as uuid } from 'uuid';
import { MessageHeader, Measurement, MeterData } from '../entity';
import { IMessageHeader, IMeasurement, IMeterData } from '../model';
import { logger } from '../logger';
import { errorResponses } from '../assets';
const convert = require('xml-js');


/**
 * Post meter data into db
 * @param {any} dbConnection typeorm connection object
 * @param {any} data request body as plain xml
 */
export async function postMeterData(dbConnection: any, data: any) {
    
    let xmlData = data;
    let jsonData;
    let messageHeaderRepository = dbConnection.getRepository(MessageHeader);
    let measurementRepository = dbConnection.getRepository(Measurement);
    let meterDataRepository = dbConnection.getRepository(MeterData);
    let postMessageHeader: IMessageHeader;
    let postMeasurement: IMeasurement;
    let postMeterData: IMeterData;

    let messageHeader: IMessageHeader;
    let measurement: IMeasurement;
    let meterData: IMeterData;

    let smgwId: string;
    let logicalDeviceId: string;
    let rawData: string;
    let forwardMeterData: any;

    let badRequest: any;

    return new Promise(async (resolve) => {

        // Validate and read body data
        try {
                        
            // Transform xml body to json
            jsonData = convert.xml2js(xmlData, { compact: false, spaces: 4 });
            
            // Validate request body
            badRequest = validateRequestBody(jsonData);
            if (badRequest !== undefined) {
                resolve({
                    status: 400,
                    error: { message: 'Bad request', error: badRequest }
                })
            } else {
                jsonData = getObjectByName(jsonData.elements, 'SOAP:Envelope')[0].elements;
                jsonData = getObjectByName(jsonData, 'SOAP:Body')[0].elements;
                forwardMeterData = getObjectByName(jsonData, 'ns2:ForwardMeterData')[0].elements;
            }

            meterData = {};
            messageHeader = constructMessageHeader(getObjectByName(forwardMeterData, 'MessageHeader')[0].elements);
            measurement = constructMeasurement(getObjectByName(forwardMeterData, 'Measurement')[0].elements);

            // SmgwId (required)
            smgwId = getObjectByName(forwardMeterData, 'SmgwId')[0].elements[0].text;
            // LogicalDeviceId (optional)
            if (getObjectByName(forwardMeterData, 'LogicalDeviceId').length > 0 ) { 
                logicalDeviceId = getObjectByName(forwardMeterData, 'LogicalDeviceId')[0].elements[0].text;
            }
            // RawData (optional)
            if (getObjectByName(forwardMeterData, 'RawData').length > 0 ) { 
                rawData = getObjectByName(forwardMeterData, 'RawData')[0].elements[0].text;
            }

        } catch (error) {
            
            logger.error(error);
            resolve({
                status: 400,
                error: errorResponses.badRequest
            })
        }

        // Save message header
        try {
            
            postMessageHeader = await messageHeaderRepository.save(messageHeader);
        } catch (error) {
            
            logger.error(error);
            resolve({
                status: 500,
                error: errorResponses.internal
            })
        }

        // Save measurement
        try {
            
            postMeasurement = await measurementRepository.save(measurement);
        } catch (error) {
            
            logger.error(error);
            resolve({
                status: 500,
                error: errorResponses.internal
            })
        }

        // Save meter data
        try {
            
            meterData.pk = uuid();
            meterData.messageHeaderFK = messageHeader.pk;
            meterData.smgwId = smgwId;
            meterData.logicalDeviceId = logicalDeviceId;
            meterData.measurementFK = measurement.pk;
            meterData.rawData = rawData;
            postMeterData = await meterDataRepository.save(meterData);
        } catch (error) {
            
            logger.error(error);
            resolve({
                status: 500,
                error: errorResponses.internal
            })
        }

        logger.verbose("forward meterdata successfully performed");
        resolve({
            status: 201,
            data: postMessageHeader
        })

    })
}


/**
 * Construct message header object
 * @param {any} data request body messageHeader object
 */
function constructMessageHeader(data: any): IMessageHeader {

    let messageHeader: IMessageHeader = {};
    messageHeader.pk = uuid();
    
    // Required fields
    messageHeader.timeSent = getObjectByName(data, 'TimeSent')[0].elements[0].text;
    messageHeader.instanceId = getObjectByName(data, 'InstanceId')[0].elements[0].text;
    messageHeader.tenantId = getObjectByName(data, 'TenantId')[0].elements[0].text;
    messageHeader.meterOperatorId = getObjectByName(data, 'MeterOperatorId')[0].elements[0].text;
    
    // Optional fields
    if (getObjectByName(data, 'MessageId').length > 0 ) { 
        messageHeader.messageId = getObjectByName(data, 'MessageId')[0].attributes.systemName;
    }
    if (getObjectByName(data, 'CorrelationId').length > 0 ) { 
        messageHeader.correlationId = getObjectByName(data, 'CorrelationId')[0].elements[0].text;
    }
    if (getObjectByName(data, 'ExternalMarketParticipantId').length > 0 ) { 
        messageHeader.externalMarketParticipantId = getObjectByName(data, 'ExternalMarketParticipantId')[0].elements[0].text;
    }
    if (getObjectByName(data, 'RoutingKeyServiceBus').length > 0 ) { 
        messageHeader.routingKeyServiceBus = getObjectByName(data, 'RoutingKeyServiceBus')[0].elements[0].text;
    }
    if (getObjectByName(data, 'RoutingKeyExtern').length > 0 ) { 
        messageHeader.routingKeyExtern = getObjectByName(data, 'RoutingKeyExtern')[0].elements[0].text;
    }
    
    return messageHeader;
}


/**
 * Construct measurement object
 * @param {any} data request body measurement object
 */
function constructMeasurement(data: any): IMeasurement {

    let measurement: IMeasurement = {};
    let entry: any = getObjectByName(data, 'Entry')[0].elements;
    measurement.pk = uuid();

    // Required fields
    measurement.entryTimestamp = getObjectByName(entry, 'Timestamp')[0].elements[0].text;
    measurement.entryValue = getObjectByName(entry, 'Value')[0].elements[0].text;

    // Optional fields
    if (getObjectByName(data, 'OBIS').length > 0 ) { 
        measurement.obis = getObjectByName(data, 'OBIS')[0].elements[0].text;
    }
    if (getObjectByName(data, 'CapturePeriod').length > 0 ) { 
        measurement.capturePeriod = getObjectByName(data, 'CapturePeriod')[0].elements[0].text;
    }
    if (getObjectByName(entry, 'Scaler').length > 0 ) { 
        measurement.entryScaler = getObjectByName(entry, 'Scaler')[0].elements[0].text;
    }
    if (getObjectByName(entry, 'Unit').length > 0 ) { 
        measurement.entryUnit = getObjectByName(entry, 'Unit')[0].elements[0].text;
    }
    if (getObjectByName(entry, 'Status').length > 0 ) { 
        measurement.entryStatus = getObjectByName(entry, 'Status')[0].elements[0].text;
    }

    return measurement;
}


/**
 * Validates if all required field of the request body are existing
 * @param {any} body request body 
 */
function validateRequestBody (body: any) {

    let forwardMeterData: any;
    let messageHeader: any;
    let measurement: any;
    let entry: any;


    /* ----- SOPA payload structure ----- */

    // Required: SOAP:Envelope
    if (getObjectByName(body.elements, 'SOAP:Envelope').length === 0) {
        return { name: 'Missing field', field: 'SOAP:Envelope' };
    } else {
        body = getObjectByName(body.elements, 'SOAP:Envelope')[0].elements;
    }

    // Required: SOAP:Envelope
    if (getObjectByName(body, 'SOAP:Body').length === 0) {
        return { name: 'Missing field', field: 'SOAP:Body' };
    } else {
        body = getObjectByName(body, 'SOAP:Body')[0].elements;
    }

    // Required: ns2:ForwardMeterData
    if (getObjectByName(body, 'ns2:ForwardMeterData').length === 0) {
        return { name: 'Missing field', field: 'ns2:ForwardMeterData' };
    } else {
        forwardMeterData = getObjectByName(body, 'ns2:ForwardMeterData')[0].elements;
    }

    /* ------------- SmgwId ------------- */

    // Required: SmgwId
    if (getObjectByName(forwardMeterData, 'SmgwId').length === 0) {
        return { name: 'Missing field', field: 'SmgwId' };
    }

    /* --------- MessageHeader ---------- */

    // Required: MessageHeader
    if (getObjectByName(forwardMeterData, 'MessageHeader').length === 0) {
        return { name: 'Missing field', field: 'MessageHeader' };
    } else {
        messageHeader = getObjectByName(forwardMeterData, 'MessageHeader')[0].elements;
    }

    // Required: TimeSent
    if (getObjectByName(messageHeader, 'TimeSent').length === 0) {
        return { name: 'Missing field', field: 'TimeSent' };
    }

    // Required: InstanceId
    if (getObjectByName(messageHeader, 'InstanceId').length === 0) {
        return { name: 'Missing field', field: 'InstanceId' };
    }
   
    // Required: TenantId
    if (getObjectByName(messageHeader, 'TenantId').length === 0) {
        return { name: 'Missing field', field: 'TenantId' };
    }
    
    // Required: MeterOperatorId
    if (getObjectByName(messageHeader, 'MeterOperatorId').length === 0) {
        return { name: 'Missing field', field: 'MeterOperatorId' };
    }

    /* ---------- Measurement ----------- */

    // Required: Measurement
    if (getObjectByName(forwardMeterData, 'Measurement').length === 0) {
        return { name: 'Missing field', field: 'Measurement' };
    } else {
        measurement = getObjectByName(forwardMeterData, 'Measurement')[0].elements;
    }

    // Required: Entry
    if (getObjectByName(measurement, 'Entry').length === 0) {
        return { name: 'Missing field', field: 'Entry' }
    } else {
        entry = getObjectByName(measurement, 'Entry')[0].elements;
    }

    // Required: Entry > Timestamp
    if (getObjectByName(entry, 'Timestamp').length === 0) {
        return { name: 'Missing field', field: 'Timestamp' };
    }

    // Required: Entry > Value
    if (getObjectByName(entry, 'Value').length === 0) {
        return { name: 'Missing field', field: 'Value' };
    }

    return undefined;
}


/**
 * Helper function to get an object by its name property of an object list
 * @param {any} elementArray array of objects
 * @param {string} elementName value of filer name property
 */
function getObjectByName(elementArray: any, elementName: string) {
    
    return elementArray.filter((obj: any) => {
        return obj.name === elementName
    })
}
