Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformBase = void 0;
const events_1 = require("events");
require("./utils");
const utils_1 = require("./utils");
const index_1 = require("./index");
var Events;
(function (Events) {
    Events["Initialized"] = "initialized";
})(Events || (Events = {}));
class PlatformBase extends events_1.EventEmitter {
    constructor(logger, platformConfig, api) {
        var _a;
        super();
        this.accessoriesWrappers = new Map();
        this.accessories = new Map();
        this.accessoriesToConfigure = new Map();
        this.accessoriesToRegister = [];
        this.accessoriesToRemove = [];
        this.accessoriesToUpdate = [];
        this.logger = logger;
        this.api = api;
        this.name = (_a = platformConfig.name) !== null && _a !== void 0 ? _a : platformConfig.platform;
        this.platform = platformConfig.platform;
        this.pluginName = index_1.context.pluginName;
        this.config = platformConfig;
        const p = this.buildAccessories();
        const self = this;
        api.on('didFinishLaunching', async () => {
            var _a;
            self.logger('Homebridge Launched');
            let list = await p;
            //self.logger('ISY API Initialized');
            self.logger('Plugin Version:', index_1.context.pluginVersion);
            self.logger('Homebridge API Version:', self.api.version);
            self.logger('Homebridge Server Version:', self.api.serverVersion);
            self.logger(`Accessories to Configure: ${this.accessoriesToConfigure.size}`);
            self.logger(`Accessories Available: ${list.length}`);
            this.wireAccessories(list);
            self.logger(`Accessories Configured: ${this.accessoriesToUpdate.length}`);
            self.updatePlatformAccessories();
            self.logger(`Accessories to Register: ${this.accessoriesToRegister.length}`);
            self.registerPlatformAccessories();
            self.logger(`Orphan Accessories: ${this.accessoriesToRemove.length}`);
            if ((_a = platformConfig.keepOrphans) !== null && _a !== void 0 ? _a : true) {
                self.accessoriesToRemove = [];
            }
            self.removePlatformAccessories();
        });
    }
    updatePlatformAccessories() {
        this.api.updatePlatformAccessories(this.accessoriesToUpdate);
        this.accessoriesToUpdate = [];
    }
    registerPlatformAccessories() {
        this.api.registerPlatformAccessories(this.pluginName, this.platform, this.accessoriesToRegister);
        this.accessoriesToRegister = [];
    }
    removePlatformAccessories() {
        this.api.unregisterPlatformAccessories(this.pluginName, this.platform, this.accessoriesToRemove);
        this.accessoriesToRemove = [];
    }
    wireAccessories(accessories) {
        this.accessoriesWrappers = new Map(accessories.map(p => [p.address, p]));
        accessories.forEach(accessory => {
            if (!accessory.configured) {
                let a = this.accessoriesToConfigure.get(accessory.address);
                if (a) {
                    this.logger("Platform accessory found to configure (%s: %s)", a.displayName, a.address);
                    accessory.configure(a);
                    this.accessoriesToConfigure.delete(accessory.address);
                    this.accessoriesToUpdate.push(a);
                }
                else {
                    this.logger("Platform accessory was not found to configure (%s: %s)", accessory.displayName, accessory.address);
                    let b = accessory.configure();
                    this.accessoriesToRegister.push(b);
                }
            }
            this.accessories.set(accessory.address, accessory.platformAccessory);
        });
        this.accessoriesToRemove.push(...Array.from(this.accessoriesToConfigure.values()));
        this.accessoriesToConfigure.clear();
    }
    configureAccessory(accessory) {
        this.accessories.set(accessory.address, accessory);
        this.accessoriesToConfigure.set(accessory.address, accessory);
    }
}
exports.PlatformBase = PlatformBase;
PlatformBase.cloneLogger = utils_1.clone;
//# sourceMappingURL=platform.js.map