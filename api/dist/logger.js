"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston = require("winston");
exports.logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
        new winston.transports.File({ filename: 'logs/verbose.log', level: 'verbose' })
    ],
});
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
//# sourceMappingURL=logger.js.map