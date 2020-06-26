import {Entity, Column, PrimaryColumn} from 'typeorm';


@Entity({name: 'public.v_meter_data_set'})
export class MeterDataSet {

    @PrimaryColumn()
    pk?: string;

    @Column()
    smgwId?: string;

    @Column()
    logicalDeviceId?: string;

    @Column()
    rawData?: string;

    @Column()
    messageId?: string;

    @Column()
    correlationId?: string;

    @Column()
    timeSent?: string;

    @Column()
    instanceId?: number;

    @Column()
    tenantId?: string;

    @Column()
    meterOperatorId?: string;

    @Column()
    externalMarketParticipantId?: string;

    @Column()
    routingKeyServiceBus?: string;

    @Column()
    routingKeyExtern?: string;

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
