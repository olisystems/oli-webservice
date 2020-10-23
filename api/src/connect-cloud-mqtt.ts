import { config } from './config';
import { logger } from './logger';
import {Client, IClientOptions, connect, IConnackPacket} from 'mqtt';

var connectionConfig = config.mqtt.connection
var clientOptions:IClientOptions = {
    host: connectionConfig.url,
    port: connectionConfig.port,
    protocol: "mqtt",
    username: connectionConfig.username,
    password: connectionConfig.password
}

export const mqttClient = connect(clientOptions);

//client.publish('/hier/ist/mauro', JSON.stringify({"lol": "rofl"}));

//console.log('after publish')


