Object.defineProperty(exports, "__esModule", { value: true });
exports.onGet = exports.addSetCallback = exports.onSet = exports.clone = void 0;
const HB = require("homebridge");
function clone(logger, prefix, logLevel) {
    const copy1 = { ...logger };
    copy1.prefix = copy1.prefix = prefix !== null && prefix !== void 0 ? prefix : logger.prototype;
    const copy = logger.info.bind(copy1);
    Object.assign(copy, logger);
    copy.prefix = prefix !== null && prefix !== void 0 ? prefix : logger.prefix;
    copy.isDebugEnabled = () => logLevel >= "debug" /* DEBUG */;
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
    copy.trace = ((message, ...args) => {
        // onst newMsg = chalk.dim(msg);
        if (copy.isTraceEnabled()) {
            copy.log.apply(this, ['trace'].concat(message).concat(args));
        }
    }).bind(copy);
    copy.fatal = ((message, ...args) => {
        // onst newMsg = chalk.dim(msg);
        if (logger.isFatalEnabled()) {
            logger.log.apply(this, ['fatal'].concat(message).concat(args));
        }
    }).bind(copy);
    return copy;
}
exports.clone = clone;
Promise.prototype.handleWith = async function (callback) {
    return this.then((value) => {
        callback(null, value);
    }).catch((msg) => {
        callback(new Error(msg), msg);
    });
};
function onSet(character, func) {
    const cfunc = addSetCallback(func);
    return character.on("set" /* SET */, cfunc);
}
exports.onSet = onSet;
function addSetCallback(func) {
    return (arg, cb) => {
        // assumption is function has signature of (val, callback, args..)
        // const n = newArgs[1];
        try {
            func(arg).handleWith(cb);
        }
        catch (_a) {
            throw new Error('Last argument of callback is not a function.');
        }
    };
}
exports.addSetCallback = addSetCallback;
function onGet(character, func) {
    const cfunc = (cb) => {
        cb(null, func());
    };
    return character.on("get" /* GET */, cfunc);
}
exports.onGet = onGet;
//# sourceMappingURL=logger.js.map