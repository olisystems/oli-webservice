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
exports.MeterData = void 0;
const typeorm_1 = require("typeorm");
let MeterData = (() => {
    let MeterData = class MeterData {
    };
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], MeterData.prototype, "pk", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterData.prototype, "messageHeaderFK", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterData.prototype, "smgwId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterData.prototype, "logicalDeviceId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], MeterData.prototype, "measurementFK", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], MeterData.prototype, "rawData", void 0);
    MeterData = __decorate([
        typeorm_1.Entity({ name: 'public.v_meter_data' })
    ], MeterData);
    return MeterData;
})();
exports.MeterData = MeterData;
//# sourceMappingURL=meter-data.js.map