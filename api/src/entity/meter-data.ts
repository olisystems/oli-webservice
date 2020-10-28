import {Entity, Column, PrimaryColumn} from 'typeorm';


@Entity({name: 'public.v_meter_data'})
export class MeterData {

    @PrimaryColumn()
    pk?: string;

    @Column()
    messageHeaderFK?: string;

    @Column()
    smgwId?: string;

    @Column()
    logicalDeviceId?: string;

    @Column()
    measurementFK?: number;

    @Column()
    rawData?: string;

}
