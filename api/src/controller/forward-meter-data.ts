import { v4 as uuid } from 'uuid';
import { MessageHeader, Measurement, MeterData } from '../entity';
import { IMessageHeader, IMeasurement, IMeterData } from '../model';
import { logger } from '../logger';
const convert = require('xml-js');


/**
 * Post meter data into db
 * @param {any} dbConnection typeorm connection object
 * @param {any} data request body as plain xml
 */
export async function postMeterData(dbConnection: any, data: any) {

    // TODO:
    // Validate incoming request body (data)
    
    let xmlData = data;
    let jsonData = convert.xml2js(xmlData, { compact: false, spaces: 4 });
    let messageHeaderRepository = dbConnection.getRepository(MessageHeader);
    let measurementRepository = dbConnection.getRepository(Measurement);
    let meterDataRepository = dbConnection.getRepository(MeterData);

    let messageHeader: IMessageHeader = constructMessageHeader(jsonData.elements[0].elements[1].elements[0].elements[0].elements);
    let measurement: IMeasurement = constructMeasurement(jsonData.elements[0].elements[1].elements[0].elements[3].elements);
    let meterData: IMeterData = {};

    let smgwId: string = jsonData.elements[0].elements[1].elements[0].elements[1].elements[0].text;
    let logicalDeviceId: string = jsonData.elements[0].elements[1].elements[0].elements[2].elements[0].text;
    let rawData: string = jsonData.elements[0].elements[1].elements[0].elements[4].elements[0].text;    

    let postMessageHeader: IMessageHeader;
    let postMeasurement: IMeasurement;
    let postMeterData: IMeterData;

    return new Promise(async (resolve) => {

        try {
            postMessageHeader = await messageHeaderRepository.save(messageHeader);
        } catch (error) {
            
            logger.error(error);
            resolve({
                status: 500,
                error: error
            })
        }

        try {
            postMeasurement = await measurementRepository.save(measurement);
        } catch (error) {
            
            logger.error(error);
            resolve({
                status: 500,
                error: error
            })
        }

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
                error: error
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


/**
 * Construct measurement object
 * @param {any} data request body measurement object
 */
function constructMeasurement(data: any): IMeasurement {

    let measurement: IMeasurement = {};
    let entry: any = getObjectByName(data, 'met:Entry')[0].elements;
    measurement.pk = uuid();
    measurement.obis = getObjectByName(data, 'met:OBIS')[0].elements[0].text;
    measurement.capturePeriod = getObjectByName(data, 'met:CapturePeriod')[0].elements[0].text;
    measurement.entryTimestamp = getObjectByName(entry, 'met:Timestamp')[0].elements[0].text;
    measurement.entryValue = getObjectByName(entry, 'met:Value')[0].elements[0].text;
    measurement.entryScaler = getObjectByName(entry, 'met:Scaler')[0].elements[0].text;
    measurement.entryUnit = getObjectByName(entry, 'met:Unit')[0].elements[0].text;
    measurement.entryStatus = getObjectByName(entry, 'met:Status')[0].elements[0].text;

    return measurement;
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
