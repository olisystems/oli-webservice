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
exports.Measurement = void 0;
const typeorm_1 = require("typeorm");
let Measurement = (() => {
    let Measurement = class Measurement {
    };
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], Measurement.prototype, "pk", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Measurement.prototype, "obis", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Measurement.prototype, "capturePeriod", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Measurement.prototype, "entryTimestamp", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Measurement.prototype, "entryValue", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Measurement.prototype, "entryScaler", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Measurement.prototype, "entryUnit", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Measurement.prototype, "entryStatus", void 0);
    Measurement = __decorate([
        typeorm_1.Entity({ name: 'public.v_measurement' })
    ], Measurement);
    return Measurement;
})();
exports.Measurement = Measurement;
//# sourceMappingURL=measurement.js.map