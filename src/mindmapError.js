/**
 * @author season <season-studio@outlook.com>
 * @license Apache-2.0
 */

/**
 * @classdesc Basic class of error from mindmap
 * @class
 * @constructor
 * @param {Number} _code the code of the error
 * @param {String} _msg the message of the error
 * @param {*} _detail the external data of the error
 * @param  {...any} _args any other arguments passed to the basic constructor of Error
 */
export function MindmapError(_code, _msg, _detail, ..._args) {
    if (this instanceof MindmapError) {
        let instance = Reflect.construct(Error, [_msg, ..._args]);
        instance.code = _code;
        instance.detail = _detail;
        Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
        if (Error.captureStackTrace) {
            Error.captureStackTrace(instance, MindmapError);
        }
        return instance;
    } else {
        return Reflect.construct(MindmapError, ...arguments);
    }
}
  
MindmapError.prototype = Object.create(Error.prototype, {
    constructor: {
      value: Error,
      enumerable: false,
      writable: true,
      configurable: true
    }
});

if (Object.setPrototypeOf){
    Object.setPrototypeOf(MindmapError, Error);
} else {
    MindmapError.__proto__ = Error;
}