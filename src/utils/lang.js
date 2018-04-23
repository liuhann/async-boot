const _toString = Object.prototype.toString;

export function isFunction(object) {
    return !!(object && object.constructor && object.call && object.apply);
}

export function isUndef (v) {
    return v === undefined || v === null
}

export function isPrimitive (value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    )
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * 检查对象是否为空 见样例
 * isEmpty(""), // true
 * isEmpty(33), // true (arguably could be a TypeError)
 * isEmpty([]), // true
 * isEmpty({}), // true
 * isEmpty({length: 0, custom_property: []}), // true
 * isEmpty("Hello"), // false
 * isEmpty([1,2,3]), // false
 * isEmpty({test: 1}), // false
 * isEmpty({length: 3, custom_property: [1,2,3]}) // false
 * @param obj
 * @returns {boolean}
 */
export function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

/**
 * 判断传入的参数对象是否是纯粹的对象类型
 * @method isPlainObject
 * @param {object} o
 * @return 传入对象是纯粹的对象，则返回true；否则返回false;
 */
export function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
}

/**
 * 判断传入的参数对象是否是正则表达式类型
 * @method isRegExp
 * @param {object} regexp
 * @return 传入对象是正则，则返回true；否则返回false;
 */
export function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
}

/**
 * 判断传入的参数对象是否是数值类型
 * @method isNumber
 * @param {object} - num
 * @return 传入对象是数字，则返回true；否则返回false;
 */
export function isNumber(num) {
    return (_toString.call(num).slice(8, -1) === "Number");
}

/**
 * 判断传入的参数对象是否是布尔类型
 * @method isBoolean
 * @param {object} - bol
 * @return 传入对象是布尔，则返回true；否则返回false;
 */
export function isBoolean(bol) {
    return (_toString.call(bol).slice(8, -1) === "Boolean");
}

/**
 * 判断传入的参数对象是否是字符串类型
 * @method isString
 * @param {object} - str
 * @return 传入对象是字符串，则返回true；否则返回false;
 */
export function isString(str) {
    return (_toString.call(str).slice(8, -1) === "String");
}


/**
 * 判断传入参数是否是Arguments类型
 * @param item
 * @returns {boolean}
 */
export function isArgs( item ) {
    return _toString.call( item ) === '[object Arguments]';
}


/**
 * 判断传入的参数对象是否是数组类型
 * @method isArray
 * @param {object} array
 * @return 传入对象是函数，则返回true；否则返回false;
 */
export function isArray(array) {
    return _toString.call(array) === "[object Array]";
}

export function asArray(...data) {
    if (data.length === 1 && isArray(data[0])) {
        return data[0];
    } else {
        return data;
    }
}