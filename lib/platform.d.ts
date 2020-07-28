/// <reference types="node" />
import { PlatformAccessory, DynamicPlatformPlugin, API, Logging, PlatformConfig } from 'homebridge';
import { EventEmitter } from 'events';
import { AccessoryBase } from './accessory';
import './utils';
import { clone } from './utils';
export declare type PlatformConfigBase = PlatformConfig & {
    keepOrphans?: boolean;
};
export declare abstract class PlatformBase<T extends AccessoryBase<any>, TConfig extends PlatformConfigBase> extends EventEmitter implements DynamicPlatformPlugin {
    static cloneLogger: typeof clone;
    readonly config: TConfig;
    readonly api: API;
    readonly logger: Logging;
    readonly name: string;
    pluginName: string;
    accessoriesWrappers: Map<string, T>;
    readonly accessories: Map<string, PlatformAccessory>;
    readonly accessoriesToConfigure: Map<string, PlatformAccessory>;
    accessoriesToRegister: PlatformAccessory[];
    accessoriesToRemove: PlatformAccessory[];
    accessoriesToUpdate: PlatformAccessory[];
    platform: string;
    constructor(logger: Logging, platformConfig: TConfig, api: API);
    updatePlatformAccessories(): void;
    registerPlatformAccessories(): void;
    removePlatformAccessories(): void;
    abstract buildAccessories(): Promise<Array<T>>;
    wireAccessories(accessories: T[]): void;
    configureAccessory(accessory: PlatformAccessory): void;
}
