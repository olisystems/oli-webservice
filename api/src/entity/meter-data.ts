import {Entity, Column, PrimaryColumn} from 'typeorm';


@Entity({name: 'public.v_meter_data'})
export class MeterData {

    @PrimaryColumn("text")
    pk?: string;

    @Column("text")
    messageHeaderFK?: string;

    @Column("text")
    smgwId?: string;

    @Column("text")
    logicalDeviceId?: string;

    @Column("integer")
    measurementFK?: number;

    @Column("text")
    rawData?: string;

}
