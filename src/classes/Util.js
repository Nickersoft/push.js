export default class Util {
    static isUndefined(obj) {
        return obj === undefined;
    }

    static isString(obj) {
        return typeof obj === 'string';
    }

    static isFunction(obj) {
        return obj && {}.toString.call(obj) === '[object Function]';
    }
}
