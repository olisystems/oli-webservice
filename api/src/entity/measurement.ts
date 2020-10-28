import {Entity, Column, PrimaryColumn} from 'typeorm';


@Entity({name: 'public.v_measurement'})
export class Measurement {

    @PrimaryColumn()
    pk?: string;

    @Column()
    obis?: string;

    @Column()
    capturePeriod?: string;

    @Column()
    entryTimestamp?: string;

    @Column()
    entryValue?: string;

    @Column()
    entryScaler?: number;

    @Column()
    entryUnit?: string;

    @Column()
    entryStatus?: string;

}
