import { mqttClient } from '../connect-cloud-mqtt';
import { logger } from '../logger';
import { Measurement, MeterData } from '../entity';

const topicMapping: Map<string,string> = new Map([
    ["23","WIRCON/OLI_23/PV/activeEnergy/Supply"],
    ["24","WIRCON/OLI_24/PV/activeEnergy/Supply"],
    ["26","WIRCON/OLI_26/PV/activeEnergy/Supply"],
    ["61","WIRCON/OLI_61/PV/activeEnergy/Supply"],
    ["62","WIRCON/OLI_62/PV/activeEnergy/Supply"]
])
    
export function handleSMGWData(meterData: MeterData, measurement: Measurement, lastMeasurement: Measurement){
    var topic: string = getTopicName(meterData);
    var valueToSend: number = calculateValue(measurement, lastMeasurement)
    var dataToSend: any = {
        timestamp: measurement.entryTimestamp,
        value: valueToSend
    } 
    publishData(topic, dataToSend);

}

function getTopicName(meterData: MeterData):string {
    var topic: string = ""
    try {
        topic = topicMapping.get(meterData.smgwId || "") || "";
    }
    catch (error) {
        logger.error(error);
    }
    return topic;
    
}

function calculateValue(measurement: Measurement, lastMeasurement: Measurement): number{
    var value: number = 1;
    try{
        var currentMeasurementValue: number = parseFloat(measurement.entryValue || "1") * 10**(measurement.entryScaler || 1);
        var lastMeasurementValue: number = parseFloat(lastMeasurement.entryValue || "1") * 10**(lastMeasurement.entryScaler || 1);
        value = currentMeasurementValue - lastMeasurementValue;
    } catch(error) {
        logger.error(error)
    }
    return value;
}

function publishData(topic: string, dataToSend: any) {
    try {
        mqttClient.publish(topic, JSON.stringify(dataToSend));
    }
    catch (error) {
        logger.error(error);
    }
}

/*
unittest don't know where to put it
TODO
error handling should be implemented properly


var testData : MeterData ={
    smgwId: "26"
} 
var currentMeasurementValue: Measurement = {
    entryTimestamp: "123",
    entryScaler: 1,
    entryValue: "789"
}
var lastMeasurementValue: Measurement = {
    entryScaler: 1,
    entryValue: "456"
    
}
handleSMGWData(testData, currentMeasurementValue, lastMeasurementValue);
*/
