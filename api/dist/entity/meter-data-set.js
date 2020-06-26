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
exports.MeterDataSet = void 0;
const typeorm_1 = require("typeorm");
let MeterDataSet = (() => {
    let MeterDataSet = class MeterDataSet {
    };
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "pk", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "smgwId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "logicalDeviceId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "rawData", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "messageId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "correlationId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "timeSent", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], MeterDataSet.prototype, "instanceId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "tenantId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "meterOperatorId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "externalMarketParticipantId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "routingKeyServiceBus", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "routingKeyExtern", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "obis", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "capturePeriod", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "entryTimestamp", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "entryValue", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], MeterDataSet.prototype, "entryScaler", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "entryUnit", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterDataSet.prototype, "entryStatus", void 0);
    MeterDataSet = __decorate([
        typeorm_1.Entity({ name: 'public.v_meter_data_set' })
    ], MeterDataSet);
    return MeterDataSet;
})();
exports.MeterDataSet = MeterDataSet;
//# sourceMappingURL=meter-data-set.js.map