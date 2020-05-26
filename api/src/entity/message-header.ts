import {Entity, Column, PrimaryColumn} from 'typeorm';


@Entity({name: 'public.v_message_header'})
export class MessageHeader {

    @PrimaryColumn()
    pk?: string;

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

}
