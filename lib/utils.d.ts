import * as log4js from '@log4js-node/log4js-api';
import { CharacteristicSetCallback, CharacteristicValue, Service, WithUUID } from 'hap-nodejs';
import * as HB from 'homebridge';
import { Logging } from 'homebridge/lib/logger';
export declare function clone(logger: Logging, prefix: string, logLevel: HB.LogLevel): Logging;
declare module 'homebridge/lib/platformAccessory' {
    interface PlatformAccessory {
        getOrAddService<T extends WithUUID<typeof Service>>(service: T): Service;
        address: string;
    }
}
declare module 'homebridge/lib/logger' {
    interface Logger extends LoggerLike {
    }
    interface Logging extends LoggerLike {
    }
}
declare module 'hap-nodejs/dist/lib/Characteristic' {
    interface Characteristic {
        onSet<T extends CharacteristicValue>(func: (...args: any) => Promise<T>): HB.Characteristic;
        onGet<T extends CharacteristicValue>(func: () => T): HB.Characteristic;
    }
}
declare global {
    interface Promise<T> {
        handleWith(callback: (...arg: any) => void): Promise<void>;
    }
}
export declare function onSet<T extends CharacteristicValue>(character: HB.Characteristic, func: (arg: T) => Promise<any>): HB.Characteristic;
export declare function addSetCallback<T extends CharacteristicValue>(func: (...args: any[]) => Promise<T>): (arg: any, cb: CharacteristicSetCallback) => void;
export declare function onGet<T extends CharacteristicValue>(character: HB.Characteristic, func: () => T): HB.Characteristic;
export interface LoggerLike extends log4js.Logger {
    prefix?: string;
    (msg: any): void;
    default(msg: any): void;
}
