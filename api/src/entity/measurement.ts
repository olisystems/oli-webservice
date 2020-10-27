import {Entity, Column, PrimaryColumn} from 'typeorm';


@Entity({name: 'public.v_measurement'})
export class Measurement {

    @PrimaryColumn("text")
    pk?: string;

    @Column("text")
    obis?: string;

    @Column("text")
    capturePeriod?: string;

    @Column("text")
    entryTimestamp?: string;

    @Column("text")
    entryValue?: string;

    @Column("integer")
    entryScaler?: number;

    @Column("text")
    entryUnit?: string;

    @Column("text")
    entryStatus?: string;

}
