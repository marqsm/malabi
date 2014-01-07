/**
 * Malabi - utility library made for learning purposes.
 *
 * Inspiration: underscore, lo-dash, allong.es
 * PartialLeft & PartialRight and a lot of ideas and inspiration from Reginald Braithwaites excellent eBook "JavaScript Allongé"
 *
 * Autocurry-function, current version copied from wu.js - https://github.com/fitzgen/wu.js/blob/master/lib/wu.js
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

    var toArray = malabi.toArray = function(arr, from) {
        if (isUndefined(arr)) return [];
        return __slice.call(arr, from || 0);
    };

    // TODO: add support for variable number of parameters
    var partialLeft = malabi.curry = malabi.partialLeft = function(fn /*, largs */) {
        var largs = toArray(arguments, 1);
        return function() {
            var args = toArray(arguments, 0);
            return fn.apply(this, largs.concat(args));
        };
    };

    // TODO: add support for variable number of parameters
    malabi.partialRight = function(fn /*, rargs */) {
        var rargs = toArray(arguments, 1);
        return function() {
            var args = __slice.call(arguments, 0);
            return fn.apply(this, args.concat(rargs));
        };
    };

    // From http://javascriptweblog.wordpress.com/2010/06/14/dipping-into-wu-js-autocurry/
    malabi.autoCurry = function autoCurry(fn, numArgs) {
        numArgs = numArgs || fn.length;

        return function autoCurried() {
            if (arguments.length < numArgs) {
                return numArgs - arguments.length > 0 ?
                    autoCurry(partialLeft.apply(this, [fn].concat(toArray(arguments))),
                              numArgs - arguments.length) :
                    partialLeft.apply(this, [fn].concat(toArray(arguments)));
            }
            else {
                return fn.apply(this, arguments);
            }
        };
    };

    malabi.bind = function(fn, context) {
        // TODO:
    };

    malabi.duration = function(fn) {
        var args = toArray(arguments, 1),
            start = (new Date()).getTime();

        fn.apply(this, args);
        return ((new Date()).getTime() - start) / 1000;
    }

    malabi.memoize = function(fn) {
        var cache = cache || {};

        return function() {
            var key = toArray(arguments).join();

            if (isUndefined(cache[key])) {
                cache[key] = fn.apply(this, arguments);
            }
            return cache[key];
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
        } else if (isArray(a) && isArray(b)) {
            // check array items equality
            // TODO: refactor array items equality check to own function, add recursion for nested arrays check.
            if (a.length == b.length) {
                len = a.length;
                for (i = 0; i < len; i++) {
                    same = (a[i] == b[i]);
                    if (!same) return false;
                }
                return same;
            }
        }
        // TODO: compare objects

        return false;
    };
})(this);