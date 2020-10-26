import 'reflect-metadata';
import {createConnection} from "typeorm";
import { MeterDataSet } from '../entity/meter-data-set'


const smgwIdString : string = "EDNT0018068443"
var dbConnection: any;

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
    //synchronize: true,
    logging: true
}).then(connection => {
    
    let meterView = connection.getRepository(MeterDataSet);
    var oldestEntry: any = meterView.findOne({
        where : { smgwId: smgwIdString},
        order : { entryTimestamp: 'DESC' }
    }).then(oldestEntry => console.log(oldestEntry));

}).catch(error => console.log(error))


