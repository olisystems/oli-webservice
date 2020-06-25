"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHeader = void 0;
const typeorm_1 = require("typeorm");
let MessageHeader = (() => {
    let MessageHeader = class MessageHeader {
    };
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], MessageHeader.prototype, "pk", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageHeader.prototype, "messageId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageHeader.prototype, "correlationId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageHeader.prototype, "timeSent", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], MessageHeader.prototype, "instanceId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageHeader.prototype, "tenantId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageHeader.prototype, "meterOperatorId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageHeader.prototype, "externalMarketParticipantId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageHeader.prototype, "routingKeyServiceBus", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MessageHeader.prototype, "routingKeyExtern", void 0);
    MessageHeader = __decorate([
        typeorm_1.Entity({ name: 'public.v_message_header' })
    ], MessageHeader);
    return MessageHeader;
})();
exports.MessageHeader = MessageHeader;
//# sourceMappingURL=message-header.js.map