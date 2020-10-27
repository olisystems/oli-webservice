import {Entity, Column, PrimaryColumn} from 'typeorm';


@Entity({name: 'public.v_meter_data_set'})
export class MeterDataSet {

    @PrimaryColumn("text")
    pk?: string;

    @Column("text")
    smgwId?: string;

    @Column("text")
    logicalDeviceId?: string;

    @Column("text")
    rawData?: string;

    @Column("text")
    messageId?: string;

    @Column("text")
    correlationId?: string;

    @Column("text")
    timeSent?: string;

    @Column("integer")
    instanceId?: number;

    @Column("text")
    tenantId?: string;

    @Column("text")
    meterOperatorId?: string;

    @Column("text")
    externalMarketParticipantId?: string;

    @Column("text")
    routingKeyServiceBus?: string;

    @Column("text")
    routingKeyExtern?: string;

    @Column("text")
    obis?: string;

    @Column("text")
    capturePeriod?: string;

    @Column("text")
    entryTimestamp?: string;

    @Column("text")
    entryValue?: string;

    @Column("text")
    entryScaler?: number;

    @Column("text")
    entryUnit?: string;

    @Column("text")
    entryStatus?: string;

}
