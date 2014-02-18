/**
 * Malabi - utility library made for learning purposes.
 *
 * Inspiration: underscore, lo-dash, allong.es
 * - PartialLeft & PartialRight and a lot of ideas and inspiration from Reginald Braithwaites excellent eBook "JavaScript Allongé"
 *
 * - Autocurry - had one from wu.js - https://github.com/fitzgen/wu.js/blob/master/lib/wu.js,
 * but decided I'll do my own implementation.
 * - Extra inspiration from underscore
 * (eg. when can't get a function to work, read underscore source to get ideas. Or after I get it to work, see how they did it.)
 */

 /* TODO: Implement Data.List methods from Haskell (takeWhile done)
  * http://learnyouahaskell.com/modules
  */

 (function(context) {

    oldMalabi = context.malabi;
    context.malabi = {};

    // Cached functions
    var _slice = Array.prototype.slice;

    malabi.compose = function(a, b) {
        return function(c) {
            //var args = toArray(arguments);
            return a(b(c));
        };
    };

    var toArray = malabi.toArray = function(arr, from) {
        if (isUndefined(arr)) return [];
        return _slice.call(arr, from || 0);
    };

    var partialLeft = malabi.curry = malabi.partialLeft = function(fn /*, largs */) {
        var largs = toArray(arguments, 1);
        return function() {
            var args = toArray(arguments, 0);
            return fn.apply(this, largs.concat(args));
        };
    };

    malabi.partialRight = function(fn /*, rargs */) {
        var rargs = toArray(arguments, 1);
        return function() {
            var args = _slice.call(arguments, 0);
            return fn.apply(this, args.concat(rargs));
        };
    };

    // Had one from http://javascriptweblog.wordpress.com/2010/06/14/dipping-into-wu-js-autocurry/
    // TODO: Implement own.
    malabi.autoCurry = function autoCurry(fn, numArgs) {
    };

    malabi.bind = function(fn, context) {
        // TODO:
    };

    // Eg. var fib = function(n) { return (n < 2) ? n : fib(n-2) + fib(n-1); }
    // malabi.duration(fibonacci, 33)
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
    var foreach = malabi.foreach = function(set, func, context) {
        for (var i = 0; i < set.length; i++) {
            func.call(context || this, set[i], i);
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
        return arr.reduce(function(a, b) {
            if (Array.isArray(b)) {
                b = flatten(b);
            }
            return a.concat(b)
        }, []);
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

    // Inspiration: Haskell Data.List takeWhile
     malabi.takeWhile = function(set, fnCondition) {
        var i, len;

        if (isArray(set) || isString(set)) {
            len = set.length;
            for (var i=0; i < len; i++) {
                if (fnCondition(set[i]) == false) return set.slice(0, i);
            }
        }
        return [];
     }

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
        return (typeof n === 'number') ? true : false;
    };


    // Accepts anything that converts to numbers, works: 1, '1', '1.2', '1E3', doesn't: false, NaN, '1f'
    malabi.isNumeric = function(n) {
        var x = Number(n);
        if (isNaN(x) || isUndefined(n) || isNull(n)) return false;
        return (typeof x === 'number');
    };

    var isNull = malabi.isNull = function(n) {
        return (n === null);
    };

    var isString = malabi.isString = function(item) {
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