Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessoryBase = exports.PlatformBase = exports.context = exports.UUIDGen = exports.Accessory = exports.API = exports.Service = exports.Characteristic = exports.PlatformAccessory = exports.pluginInitializer = void 0;
const platform_1 = require("./platform");
Object.defineProperty(exports, "PlatformBase", { enumerable: true, get: function () { return platform_1.PlatformBase; } });
const accessory_1 = require("./accessory");
Object.defineProperty(exports, "AccessoryBase", { enumerable: true, get: function () { return accessory_1.AccessoryBase; } });
const utils_1 = require("./utils");
const finder = require("find-package-json");
let pluginName;
let pluginVersion;
exports.pluginInitializer = (platformName, constructor, homebridge) => {
    exports.PlatformAccessory = homebridge.platformAccessory;
    exports.Characteristic = homebridge.hap.Characteristic;
    exports.Service = homebridge.hap.Service;
    exports.Accessory = homebridge.hap.Accessory;
    exports.UUIDGen = homebridge.hap.uuid;
    exports.API = homebridge;
    let s = finder(module.parent);
    let k = s.next();
    let p = k.value;
    pluginName = p.name.split('/').pop(); /* Remove scope tag */
    pluginVersion = p.version;
    exports.context.pluginName = pluginName;
    exports.context.pluginVersion = pluginVersion;
    exports.PlatformAccessory.prototype.getOrAddService = function (service) {
        const acc = this;
        const serv = acc.getService(service);
        if (!serv) {
            return acc.addService(service);
        }
        return serv;
    };
    let plat = exports.PlatformAccessory.prototype;
    Object.defineProperty(plat, "address", {
        get: function () {
            var _a, _b;
            const acc = this;
            return (_b = (_a = acc.context) === null || _a === void 0 ? void 0 : _a.address) !== null && _b !== void 0 ? _b : acc.UUID;
        }
    });
    ((exports.Characteristic).prototype).onGet = function (func) {
        const c = this;
        return utils_1.onGet(c, func);
    };
    (exports.Characteristic.prototype).onSet = function (func) {
        const c = this;
        return utils_1.onSet(c, func);
    };
    /**
     * Platform "Somfy myLink"
     */
    homebridge.registerPlatform(pluginName, platformName, constructor);
};
exports.context = {
    pluginName,
    pluginVersion
};
//# sourceMappingURL=index.js.map