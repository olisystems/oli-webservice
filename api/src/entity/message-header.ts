import {Entity, Column, PrimaryColumn} from 'typeorm';


@Entity({name: 'public.v_message_header'})
export class MessageHeader {

    @PrimaryColumn("text")
    pk?: string;

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

}
