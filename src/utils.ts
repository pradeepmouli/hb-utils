import * as log4js from '@log4js-node/log4js-api';
import { CharacteristicEventTypes, CharacteristicGetCallback, CharacteristicSetCallback, CharacteristicValue, Service, WithUUID } from 'hap-nodejs';
import * as HB from 'homebridge';

import { Logging } from 'homebridge/lib/logger';
export function clone(logger: Logging, prefix: string, logLevel: HB.LogLevel): Logging {

    const copy1 = { ...logger };
    copy1.prefix = copy1.prefix = prefix ?? logger.prototype;

    const copy = logger.info.bind(copy1) as Logging;
    Object.assign(copy, logger);
    copy.prefix = prefix ?? logger.prefix;

    copy.isDebugEnabled = () => logLevel >= HB.LogLevel.DEBUG
    copy.isErrorEnabled = () => true;

    copy.isWarnEnabled = () => true;

    copy.isFatalEnabled = () => true;

    copy.isTraceEnabled = () => true;

    // copy._log = logger._log.bind(copy);
    copy.debug = logger.debug.bind(copy);
    // copy.fatal = logger..bind(copy);
    copy.info = logger.info.bind(copy);
    copy.error = logger.error.bind(copy);
    copy.warn = logger.warn.bind(copy);

    copy.trace = ((message, ...args: any[]) => {
        // onst newMsg = chalk.dim(msg);
        if (copy.isTraceEnabled()) {
            copy.log.apply(this, ['trace'].concat(message).concat(args));
        }
    }).bind(copy);

    copy.fatal = ((message, ...args: any[]) => {
        // onst newMsg = chalk.dim(msg);
        if (logger.isFatalEnabled()) {
            logger.log.apply(this, ['fatal'].concat(message).concat(args));
        }
    }).bind(copy);

    return copy;

}

declare module 'homebridge/lib/platformAccessory' {
    export interface PlatformAccessory {
        getOrAddService<T extends WithUUID<typeof Service>>(service: T): Service;


        address: string;

    }
}

declare module 'homebridge/lib/logger' {
    // tslint:disable-next-line: no-empty-interface
    export interface Logger extends LoggerLike {

    }

    // tslint:disable-next-line: no-empty-interface
    export interface Logging extends LoggerLike {

    }
}

declare module 'hap-nodejs/dist/lib/Characteristic' {
    export interface Characteristic {
        onSet<T extends CharacteristicValue>(func: (...args: any) => Promise<T>): HB.Characteristic;
        onGet<T extends CharacteristicValue>(func: () => T): HB.Characteristic;
    }
}

declare global {
    interface Promise<T> {
        handleWith(callback: (...arg: any) => void): Promise<void>;
    }
}


Promise.prototype.handleWith = async function <T extends CharacteristicValue>(callback: CharacteristicSetCallback): Promise<void> {
    return (this as Promise<T>).then((value) => {
        callback(null, value);
    },(msg) => {
        callback(new Error(msg), msg);
    });
};export function onSet<T extends CharacteristicValue>(character: HB.Characteristic, func: (arg: T) => Promise<any>): HB.Characteristic {

    const cfunc = addSetCallback(func);

    return character.on(CharacteristicEventTypes.SET, cfunc);
}


export function addSetCallback<T extends CharacteristicValue>(func: (...args: any[]) => Promise<T>): (arg: any, cb: CharacteristicSetCallback) => void {

    return (arg: any, cb: CharacteristicSetCallback) => {
        // assumption is function has signature of (val, callback, args..)

        // const n = newArgs[1];

        try {

            func(arg).handleWith(cb);
        } catch {
            throw new Error('Last argument of callback is not a function.');
        }

    };

}


export function onGet<T extends CharacteristicValue>(character: HB.Characteristic, func: () => T): HB.Characteristic {

    const cfunc = (cb: CharacteristicGetCallback) => {
        cb(null, func());
    };

    return character.on(CharacteristicEventTypes.GET, cfunc);
}

/*export interface Logging {
    prefix: string;
    (message: string, ...parameters: any[]): void;
    info(message: string, ...parameters: any[]): void;
    warn(message: string, ...parameters: any[]): void;
    error(message: string, ...parameters: any[]): void;
    debug(message: string, ...parameters: any[]): void;
    log(level: HB.LogLevel, message: string, ...parameters: any[]): void;
}*/
export interface LoggerLike extends log4js.Logger {
    prefix?: string;
    (msg: any): void;
    default(msg: any): void;

}
