
import { MessageHeader } from '../entity';
import { IMessageHeader } from '../model';

const convert = require('xml-js');


/**
 * Get weather data
 */
export async function postMeterData(dbConnection: any, data: any) {

    let xmlData = data;
    let weatherRepository = dbConnection.getRepository(MessageHeader);
    let jsonData = convert.xml2js(xmlData, { compact: false, spaces: 4 });

    // message header
    console.log(jsonData.elements[0].elements[1].elements[0].elements[0].elements);
    // SmgwId
    //console.log(jsonData.elements[0].elements[1].elements[0].elements[1]);
    // LogicalDeviceId
    //console.log(jsonData.elements[0].elements[1].elements[0].elements[2]);
    // Measurement
    //console.log(jsonData.elements[0].elements[1].elements[0].elements[3]);
    // RawData
    //console.log(jsonData.elements[0].elements[1].elements[0].elements[3]);

    return new Promise(async (resolve) => {

        resolve({
            status: 201,
            data: 'getWeather'
        })
        /*
        try {
            let getWeather = await weatherRepository.find({
                order: {
                    pk: "DESC"
                },
                take: 1
            });
            resolve({
                status: 201,
                data: getWeather
            })
        } catch (error) {
            resolve({
                status: 500,
                error: error
            })
        }
        */
    })
}


function constructMessageHeader(data: any): IMessageHeader {

    let messageHeader: IMessageHeader;

}
