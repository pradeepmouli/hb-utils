import * as HB from 'homebridge';
import { PlatformBase } from './platform';
export declare abstract class AccessoryBase<TCategory extends HB.Categories> {
    category: TCategory;
    name: string;
    displayName: string;
    primaryService: HB.Service;
    accessoryInfo: HB.Service;
    UUID: string;
    logger: HB.Logging;
    api: HB.API;
    platformAccessory: HB.PlatformAccessory;
    configured: boolean;
    platform: PlatformBase<any, any>;
    context: any;
    address: any;
    constructor(platform: PlatformBase<any, any>, logger: HB.Logging, deviceName: string, displayName: string, deviceAddress?: string | number);
    configure(accessory?: HB.PlatformAccessory): HB.PlatformAccessory;
    abstract buildServices(): any;
}
