Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessoryBase = void 0;
const HB = require("homebridge");
const platform_1 = require("./platform");
const index_1 = require("./index");
class AccessoryBase {
    constructor(platform, logger, deviceName, displayName, deviceAddress) {
        var _a;
        this.configured = false;
        this.logger = platform_1.PlatformBase.cloneLogger(logger, `${platform.platform} - ${deviceName} (${deviceAddress})`, (_a = logger.level) !== null && _a !== void 0 ? _a : "info" /* INFO */);
        this.name = deviceName,
            this.UUID = index_1.UUIDGen.generate(`${deviceAddress}`);
        this.displayName = displayName;
        this.platform = platform;
        this.api = this.platform.api;
        this.address = deviceAddress;
        this.context = { ...index_1.context, address: deviceAddress };
    }
    configure(accessory = new index_1.PlatformAccessory(this.name, this.UUID, this.category)) {
        this.configured = true;
        this.platformAccessory = accessory;
        this.platformAccessory.context = this.context;
        this.buildServices();
        return accessory;
    }
}
exports.AccessoryBase = AccessoryBase;
//# sourceMappingURL=accessory.js.map