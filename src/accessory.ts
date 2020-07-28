import * as HB from 'homebridge';

import { PlatformBase } from './platform';
import { PlatformAccessory, Characteristic, Service, API, UUIDGen, context } from './index';



export abstract class AccessoryBase<TCategory extends HB.Categories>
{


    category : TCategory
    name: string;
    displayName: string;
    primaryService: HB.Service;
    accessoryInfo: HB.Service;
    UUID: string
    logger: HB.Logging;

    api: HB.API;
    platformAccessory: HB.PlatformAccessory;

    configured: boolean = false;
    platform: PlatformBase<any,any>;
    context: any;

    address: any;


    constructor (platform: PlatformBase<any, any>, logger: HB.Logging, deviceName: string, displayName: string, deviceAddress?: string | number)
    {
        this.logger = PlatformBase.cloneLogger(logger,`${platform.platform} - ${deviceName} (${deviceAddress})`,logger.level as HB.LogLevel ?? HB.LogLevel.INFO);
        this.name = deviceName,
        this.UUID = UUIDGen.generate(`${deviceAddress}`);
        this.displayName = displayName;
        this.platform = platform;
        this.api = this.platform.api;
        this.address = deviceAddress;
        this.context = {...context, address: deviceAddress};
    }

    configure(accessory: HB.PlatformAccessory = new PlatformAccessory(this.name,this.UUID,this.category))
    {
        this.configured = true;
        this.platformAccessory = accessory;
        this.platformAccessory.context = this.context;
        this.buildServices();
        return accessory;
    }

    abstract buildServices();

}
