import { mqttClient } from '../connect-cloud-mqtt';
import { logger } from '../logger';
import { Measurement } from '../entity';

const topicMapping: Map<string,string> = new Map([
    ["EDNT0018068446","WIRCON/OLI_23/PV/activeEnergy/Supply"],
    ["EDNT0020035232","WIRCON/OLI_24/PV/activeEnergy/Supply"],
    ["EDNT0018068443","WIRCON/OLI_26/PV/activeEnergy/Supply"],
    ["EDNT0020035231","WIRCON/OLI_61/PV/activeEnergy/Supply"],
    ["EDNT0019035601","WIRCON/OLI_62/PV/activeEnergy/Supply"],
])

const rounding = parseFloat(process.env.ROUNDING || '0');
    
export function handleSMGWData(smgwId: string, measurement: Measurement, lastMeasurement: Measurement){
    var topic: string = getTopicName(smgwId);
    var valueToSend: number = calculateValue(measurement, lastMeasurement)
    var dataToSend: any = {
        timestamp: Date.parse(measurement.entryTimestamp ||''),
        value: valueToSend
    } 
    publishData(topic, dataToSend);

}

function getTopicName(smgwId: string):string {
    var topic: string = ""
    try {
        topic = topicMapping.get(smgwId) || "";
    }
    catch (error) {
        logger.error("Did not find a corresponding topic to the given smgwId: " + smgwId)
        logger.error(error);
    }
    return topic;
    
}

function calculateValue(measurement: Measurement, lastMeasurement: Measurement): number{
    var value: number = 1;
    try{
        var currentMeasurementValue: number = (parseFloat(measurement.entryValue || "1") * 10**(measurement.entryScaler || 0));
        var lastMeasurementValue: number = (parseFloat(lastMeasurement.entryValue || "1") * 10**(lastMeasurement.entryScaler || 0));
        value = currentMeasurementValue - lastMeasurementValue;
    } catch(error) {
        logger.error("Could not calculate the different values between two timestamps.")
        logger.error(error)
    }
    
    return parseInt(value.toFixed(rounding));
}

function publishData(topic: string, dataToSend: any) {
    let data = JSON.stringify({
        "timestamp" : dataToSend.timestamp,
        "value" : dataToSend.value
    })
    try {
        mqttClient.publish(topic, data)
        logger.info("published data: " + data);
    }
    catch (error) {
        logger.error("Could not publiish data to mqtt broker.")
        logger.error(error);
    }
}


/*
Unittest for calculating the value
*/
var currentMeasurementValue: Measurement = {
    entryTimestamp: "123",
    entryScaler: 0,
    entryValue: "1"
}
var lastMeasurementValue: Measurement = {
    entryScaler: -1,
    entryValue: "6"
    
}
let value = calculateValue(currentMeasurementValue, lastMeasurementValue)
console.log(value)


/*
Unittest for publishData
You have to inject the client credentials in the config file first, to make the publishing possible

let testTopic: string = "test";
let testData:any = {
    timestamp: Date.now(),
    value : 123
} 
publishData(testTopic, testData)
*/

/*
unittest don't know where to put it
You have to inject the client credentials in the config file first, to make the publishing possible

var testData : string = smgwId: "26";

var currentMeasurementValue: Measurement = {
    entryTimestamp: "123",
    entryScaler: 1,
    entryValue: "789"
}
var lastMeasurementValue: Measurement = {
    entryScaler: 1,
    entryValue: "456"
    
}
handleSMGWData(smgwId, currentMeasurementValue, lastMeasurementValue);
*/
