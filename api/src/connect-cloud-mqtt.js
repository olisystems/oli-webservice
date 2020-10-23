"use strict";
exports.__esModule = true;
exports.rofl = void 0;
var config_1 = require("./config");
var mqtt_1 = require("mqtt");
var connectionConfig = config_1.config.mqtt.connection;
var clientOptions = {
    host: connectionConfig.url,
    port: connectionConfig.port,
    protocol: "mqtt",
    username: connectionConfig.username,
    password: connectionConfig.password
};
var client = mqtt_1.connect(clientOptions);
console.log(client.connected);
client.publish('/hier/ist/mauro', JSON.stringify({ "lol": "rofl" }));
/*
client.subscribe({[TOPIC]: {qos: 0}}, (err, granted) => {
    granted.forEach(({topic, qos}) => {
        console.log(`subscribed to ${topic} with qos=${qos}`)
    })
    //client.publish(TOPIC, PAYLOAD_QOS, {qos: 0})
    //client.publish(TOPIC, PAYLOAD_RETAIN, {retain: true})
}).on('message', (topic: string, payload: Buffer) => {
    console.log(`message from ${topic}: ${payload}`)
}).on('connect', (packet: IConnackPacket) => {
    console.log('connected!', JSON.stringify(packet))
})*/
/*
export async function cloudMqttConnection() {
    var mqtt  = require('mqtt');
}*/
function rofl() {
    var bla = 'lol';
    console.log(bla);
}
exports.rofl = rofl;
