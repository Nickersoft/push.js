export default class Util {
  static isUndefined(obj: any) {
    return obj === undefined;
  }

  static isNull(obj: any) {
    return obj === null;
  }

  static isString(obj: any) {
    return typeof obj === "string";
  }

  static isFunction(obj: any) {
    return obj && {}.toString.call(obj) === "[object Function]";
  }

  static isObject(obj: any) {
    return typeof obj === "object";
  }

  static objectMerge(target: object, source: object) {
    for (const key in source) {
      if (
        target.hasOwnProperty(key) &&
        this.isObject(target[key]) &&
        this.isObject(source[key])
      ) {
        this.objectMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
}
