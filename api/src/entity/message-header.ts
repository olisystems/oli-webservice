import {Entity, Column, PrimaryColumn} from 'typeorm';


@Entity({name: 'public.v_message_header'})
export class MessageHeader {

    @PrimaryColumn("text")
    pk?: string;

    @Column("text")
    messageId?: string;

    @Column("text")
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
