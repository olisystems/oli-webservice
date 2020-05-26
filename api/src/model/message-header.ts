
export interface IMessageHeader {
    pk?: string;
    messageId?: string;
    correlationId?: string;
    timeSent?: string;
    instanceId?: string;
    tenantId?: string;
    meterOperatorId?: string;
    externalMarketParticipantId?: string;
    routingKeyServiceBus?: string;
    routingKeyExtern?: string;
}
