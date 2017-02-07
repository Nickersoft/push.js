export default {
    isUndefined: obj => obj === undefined,
    isString: obj => typeof obj === 'string',
    isFunction: obj => obj && {}.toString.call(obj) === '[object Function]'
}
