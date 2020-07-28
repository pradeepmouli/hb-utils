import { PlatformAccessory, Service, PlatformAccessoryEvent, Characteristic, Categories, DynamicPlatformPlugin, API, Logging, PlatformConfig } from
    'homebridge';
import { EventEmitter } from 'events';
import { AccessoryBase } from './accessory';
import './utils';
import { access } from 'fs';
import { clone } from './utils';
import { context } from './index';

enum Events {
    Initialized = 'initialized'

}

export type PlatformConfigBase = PlatformConfig & { keepOrphans?: boolean; };


export abstract class PlatformBase<T extends AccessoryBase<any>, TConfig extends PlatformConfigBase> extends EventEmitter implements DynamicPlatformPlugin {

    public static cloneLogger = clone;

    readonly config: TConfig;

    readonly api: API;
    readonly logger: Logging;
    readonly name: string;

    pluginName: string;

    accessoriesWrappers: Map<string, T> = new Map();

    readonly accessories: Map<string, PlatformAccessory> = new Map();

    readonly accessoriesToConfigure: Map<string, PlatformAccessory> = new Map();

    accessoriesToRegister: PlatformAccessory[] = [];



    accessoriesToRemove: PlatformAccessory[] = [];

    accessoriesToUpdate: PlatformAccessory[] = [];
    platform: string;

    constructor (logger: Logging, platformConfig: TConfig, api: API) {
        super();
        this.logger = logger;
        this.api = api;
        this.name = platformConfig.name ?? platformConfig.platform;
        this.platform = platformConfig.platform;
        this.pluginName = context.pluginName;
        this.config = platformConfig;
        const p = this.buildAccessories();

        const self = this;
        api.on('didFinishLaunching', async () => {





            self.logger('Homebridge Launched');
            let list = await p;

            //self.logger('ISY API Initialized');
            self.logger('Plugin Version:', context.pluginVersion);
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
            if (platformConfig.keepOrphans ?? true) {
                self.accessoriesToRemove = [];
            }
            self.removePlatformAccessories();
        });

    }

    public updatePlatformAccessories() {
        this.api.updatePlatformAccessories(this.accessoriesToUpdate);
        this.accessoriesToUpdate = [];
    }

    public registerPlatformAccessories() {
        this.api.registerPlatformAccessories(this.pluginName, this.platform, this.accessoriesToRegister);
        this.accessoriesToRegister = [];
    }

    public removePlatformAccessories() {
        this.api.unregisterPlatformAccessories(this.pluginName, this.platform, this.accessoriesToRemove);
        this.accessoriesToRemove = [];
    }

    public abstract async buildAccessories(): Promise<Array<T>>;

    public wireAccessories(accessories: T[]) {
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
        }
        );
        this.accessoriesToRemove.push(...Array.from(this.accessoriesToConfigure.values()));
        this.accessoriesToConfigure.clear();
    }


    public configureAccessory(accessory: PlatformAccessory): void {

        this.accessories.set(accessory.address, accessory);
        this.accessoriesToConfigure.set(accessory.address, accessory);

    }
}