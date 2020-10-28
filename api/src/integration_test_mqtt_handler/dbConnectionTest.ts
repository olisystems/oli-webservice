import { resolve } from 'path';
import 'reflect-metadata';
import {createConnection} from "typeorm";
import { MeterDataSet } from '../entity/meter-data-set'
import { Measurement, MeterData } from '../entity';
import { handleSMGWData } from '../controller/mqtt-handler';


const smgwId : string = "EDNT0018068443"
var oldestEntry: any
var currentMeasurementValue: Measurement = {
    entryTimestamp: "123",
    entryScaler: 1,
    entryValue: "789"
}

createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "postgres",
    entities: [
        "../entity/*.js"
    ],
    synchronize: false,
    logging: false
    })
    .then(async connection => {
        let meterView = connection.getRepository(MeterDataSet);
        oldestEntry = await getQuery(smgwId, meterView)
        handleSMGWData(smgwId, currentMeasurementValue, oldestEntry);
        await connection.close();
        return;
    })
    .catch(error => {
        console.log(error)
    })


async function getQuery(smgwId: string, meterView: any) {
    return new Promise(async (resolve) => {
        resolve(meterView.findOne({
            where : { smgwId: smgwId},
            order : { entryTimestamp: 'DESC' }
        }))
    }) 
}
