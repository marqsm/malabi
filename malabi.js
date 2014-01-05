/**
 * Malabi - utility library made for learning purposes.
 *
 * Inspiration: underscore, lo-dash, allong.es
 * PartialLeft & PartialRight and a lot of ideas and inspiration from Reginald Braithwaites excellent eBook "JavaScript Allongé"
 */
 (function(context) {

    oldMalabi = context.malabi;
    context.malabi = {};

    // Cached functions
    var __slice = Array.prototype.slice;

    // Constantish
    var __breaker = null;

    malabi.compose = function(a, b) {
        return function(c) {
            //var args = toArray(arguments);
            return a(b(c));
        };
    };

    var toArray = malabi.toArray = function() {
        return __slice.call(arguments);
    };

    // TODO: add support for variable number of parameters
    malabi.partialLeft = function(fn, larg) {
        return function() {
            var args = __slice.call(arguments, 0);
            return fn.apply(this, [larg].concat(args));
        };
    };

    // TODO: add support for variable number of parameters
    malabi.partialRight = function(fn, rarg) {
        return function() {
            var args = __slice.call(arguments, 0);
            return fn.apply(this, args.concat(rarg));
        };
    };

    // TODO: add support for variable number of parameters
    malabi.curry = function(fn, larg) {
        return function() {
            var args = __slice.call(arguments, 0);
            return null;
        };
    };

    malabi.range = function(end) {
        var arr = [];

        for (i=1; i<=end; i++) {
            arr.push(i);
        }
        return arr;
    };

    // usage foreach(set, function(value, index) { return 'new_value'; })
    var foreach = malabi.foreach = function(set, func) {
        for (var i = 0; i < set.length; i++) {
            func(set[i], i);
        }
    };

    malabi.filter = function(set, filterFunc) {
        var res = [];
        foreach(set, function(item) {
            if (filterFunc(item)) {
                res.push(item);
            }
        });
        return res;
    };

    malabi.map = function(set, func) {
        var arr = [];
        foreach(set, function(value, index) {
            arr.push(func(value, index));
        });
        return arr;
    };

    malabi.pluck = function(set, propertyName) {
        var arr = [];
        foreach(set, function(value) {
            arr.push(value[propertyName]);
        });
        return arr;
    };

    // TODO: stop iterating if value found
    malabi.contains = function(set, matchValue) {
        var hasValue = false;
        foreach(set, function(value) {
            if (value === matchValue) {
                hasValue = true;
            }
        });
        return hasValue;
    }


    // TEST: reduce([1, 2, 3, 4, 5], function(sum, curr) { return sum + curr}) == 15
    // TEST: reduce([[0, 1], [2, 3], [4, 5]], function(a, b) { return a.concat(b); }) isEqual [0, 1, 2, 3, 4, 5]
    var reduce = malabi.reduce = function(set, func, optInitialValue) {
        var sum = optInitialValue;
        if (isUndefined(optInitialValue) && isArray(set[0])) {
            sum = [];
        } else {
            sum = null;
        }

        for (var index=0; index < set.length; index++) {
            sum = func(sum, set[index], index, set);
        }
        return sum;
    };

    /**
     * Array functions
     */
     // TODO: flattens nested arrays
    var flatten = malabi.flatten = function(arr) {
        var flat = arr.reduce(function(a, b) {
            if (Array.isArray(b)) {
                b = flatten(b);
            }
            return a.concat(b)
        }, []);
        return flat;
    };

    malabi.first = function(set) {
        if (isArray(set)) {
            if (set.length > 0) {
                return set[0];
            }
            return [];
        } else if (isString(set)) {
            if (set.length > 0) {
                return set.slice(0, 1);
            }
            return '';
        }
        return null;
    };

    malabi.rest = function(set) {
        if (isArray(set)) {
            if (set.length > 1) {
                return set.splice(1);
            }
            return [];
        } else if (isString(set)) {
            if (set.length > 1) {
                return set.slice(1);
            }
            return '';
        }
        return null;
     };

     malabi.last = function(set) {
        if (isArray(set)) {
            if (set.length > 0) {
                return set[set.length - 1];
            }
            return [];
        } else if (isString(set)) {
            if (set.length > 0) {
                return set.slice(-1);
            }
            return '';
        }
        return [];
     };



    /**
     * Type checks
     */
    var isUndefined = malabi.isUndefined = function(item) {
        if (typeof item === 'undefined') {
            return true;
        }
        return false;
    };

    // TEST: ['a', null, 1, '1', undefined, [], {}, function() {}]
    var isArray = malabi.isArray = function(item) {
        if (Object.prototype.toString.call(item) == '[object Array]') {
            return true;
        }
        return false;
    };

    // accepts numbers, not strings etc.
    malabi.isNumber = function(n) {
        return (typeof n === 'number' ? true : false);
    };


    // Accepts anything that converts to numbers, works: 1, '1', '1.2', '1E3', doesn't: false, NaN, '1f'
    malabi.isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    malabi.isString = function(item) {
        if (typeof item === 'string') {
            return true;
        }
        return false;
    };

    malabi.isEqual = function(a, b) {
        var len, i, same = true;

        if (a === b) {
            return true;
        // check array equality
        } else if (isArray(a) && isArray(b)) {
            if (a.length == b.length) {
                len = a.length;
                for (i = 0; i < len; i++) {
                    same = (a[i] == b[i]);
                    if (!same) break;
                }
                return same;
            }
        }
        // TODO: compare objects

        return false;
    };
})(this);