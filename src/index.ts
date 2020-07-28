import { PlatformBase, PlatformConfigBase} from './platform'
import { AccessoryBase } from './accessory'
import { clone, onGet, onSet } from './utils';

import * as HB from 'homebridge';
import { Characteristic as C, PlatformAccessory as PA, Service as S, Accessory as A, PlatformPluginConstructor, API as api_1 } from 'homebridge';
import { caller, Module } from 'module';
import * as finder from 'find-package-json';

let pluginName : string;
let pluginVersion: string;

export const pluginInitializer = (platformName: string,  constructor: PlatformPluginConstructor, homebridge: HB.API) => {

    PlatformAccessory = homebridge.platformAccessory;
    Characteristic = homebridge.hap.Characteristic;
    Service = homebridge.hap.Service;
    Accessory = homebridge.hap.Accessory;
    UUIDGen = homebridge.hap.uuid;
    API = homebridge;

    let  s = finder(module.parent);
    let k = s.next();
    let p =  k.value;
    pluginName = p.name.split('/').pop(); /* Remove scope tag */
    pluginVersion = p.version;
    context.pluginName = pluginName;
    context.pluginVersion = pluginVersion;


    PlatformAccessory.prototype.getOrAddService = function (service: HB.WithUUID<typeof Service>): HB.Service {
        const acc = this as unknown as HB.PlatformAccessory;
        const serv = acc.getService(service);
        if (!serv) {
            return acc.addService(service);
        }
        return serv;
    };

    let plat = PlatformAccessory.prototype;
    Object.defineProperty(plat, "address",

    {
    get: function(): string
    {
        const acc = this as unknown as HB.PlatformAccessory;

        return acc.context?.address ?? acc.UUID;

    }});
    
    ((Characteristic).prototype).onGet = function (func: () => HB.CharacteristicValue): HB.Characteristic {
        const c = this as unknown as HB.Characteristic;
        return onGet(c, func);

    };

    (Characteristic.prototype).onSet = function (func: (arg: HB.CharacteristicValue) => Promise<any>): HB.Characteristic {
        const c = this as unknown as HB.Characteristic;
        return onSet(c, func);
    };


    /**
     * Platform "Somfy myLink"
     */



    homebridge.registerPlatform(
        pluginName,
        platformName,
        constructor
    );
};


export let PlatformAccessory: typeof PA;
export let Characteristic: typeof C;
export let Service : typeof S;
export let API: HB.API;
export let Accessory: typeof A;
export let UUIDGen: typeof import("hap-nodejs/dist/lib/util/uuid");

export let context = {
    pluginName,
    pluginVersion

}

export {PlatformBase, PlatformConfigBase, AccessoryBase};