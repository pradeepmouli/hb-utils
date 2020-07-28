import { PlatformBase, PlatformConfigBase } from './platform';
import { AccessoryBase } from './accessory';
import * as HB from 'homebridge';
import { Characteristic as C, PlatformAccessory as PA, Service as S, Accessory as A, PlatformPluginConstructor } from 'homebridge';
export declare const pluginInitializer: (platformName: string, constructor: PlatformPluginConstructor, homebridge: HB.API) => void;
export declare let PlatformAccessory: typeof PA;
export declare let Characteristic: typeof C;
export declare let Service: typeof S;
export declare let API: HB.API;
export declare let Accessory: typeof A;
export declare let UUIDGen: typeof import("hap-nodejs/dist/lib/util/uuid");
export declare let context: {
    pluginName: string;
    pluginVersion: string;
};
export { PlatformBase, PlatformConfigBase, AccessoryBase };
