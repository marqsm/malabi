/**
 * Malabi - utility library made for learning purposes.
 *
 * Inspiration: underscore, lo-dash, allong.es
 * - Essentials for PartialLeft & PartialRight and a lot of ideas and inspiration from Reginald Braithwaites excellent eBook "JavaScript Allongé"
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

    malabi.bind = function(context, fn) {
        return function() {
            return fn.apply(context, arguments);
        }
    };

    // Heavily influenced by Javascript Allongé
    malabi.partialLeft = malabi.curry = function(fn /*, leftArgs */) {
        var leftArgs = toArray(arguments, 1);
        return function(/* rightArgs */) {
            var rightArgs = toArray(arguments);
            return fn.apply(this, leftArgs.concat(rightArgs));
        };
    };

    // Heavily influenced by Javascript Allongé
    malabi.partialRight = function(fn /*, rightArgs */) {
        var rightArgs = toArray(arguments, 1);
        return function(/* leftArgs */) {
            var leftArgs = toArray(arguments);
            return fn.apply(this, leftArgs.concat(rightArgs));
        };
    };

    // Had one from http://javascriptweblog.wordpress.com/2010/06/14/dipping-into-wu-js-autocurry/
    // TODO: Implement own.
    malabi.autoCurry = function autoCurry(fn, numArgs) {
    };

    var identity = malabi.identity = function(x) {
        return x;
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
     // Flatten all nested arrays
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

    // Inspiration: Haskell Data.List takeWhile (description from "Learn you a Haskell for great good")
    // takeWhile is a really useful little function. It takes elements from a list while the predicate holds and then when an element is encountered that doesn't satisfy the predicate, it's cut off. It turns out this is very useful.
    // takeWhile (>3) [6,5,4,3,2,1,2,3,4,5,4,3,2,1]  returns [6,5,4]
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

    // (description from "Learn you a Haskell for great good")
    // dropWhile is similar, only it drops all the elements while the predicate is true. Once predicate equates to False, it returns the rest of the list. An extremely useful and lovely function!
    // dropWhile (<3) [1,2,2,2,3,4,5,4,3,2,1]  returns [3,4,5,4,3,2,1]
    malabi.dropWhile = function() {

    }

    // (description from "Learn you a Haskell for great good")
    // "takes an element and a list and then puts that element in between each pair of elements in the list. Here's a demonstration:"
    // intersperse("MONKEY") returns 'M.O.N.K.E.Y'
    // TODO: Handle both arrays and strings.
    malabi.intersperse = function(el, list) {

    }

    // (description from "Learn you a Haskell for great good")
    // intercalate takes a list of lists and a list. It then inserts that list in between all those lists and then flattens the result.
    // eg. intercalate " " ["hey","there","guys"]  returns "hey there guys"
    // intercalate [0,0,0] [[1,2,3],[4,5,6],[7,8,9]] returns [1,2,3,0,0,0,4,5,6,0,0,0,7,8,9]
    malabi.intercalate = function(list, lists) {

    }

    // (description from "Learn you a Haskell for great good")
    // group takes a list and groups adjacent elements into sublists if they are equal.
    // group [1,1,1,1,2,2,2,2,3,3,2,2,2,5,6,7]  returns [[1,1,1,1],[2,2,2,2],[3,3],[2,2,2],[5],[6],[7]]
    malabi.group = function(list) {

    }

    // (description from "Learn you a Haskell for great good")
    // partition takes a list and a predicate and returns a pair of lists. The first list in the result contains all the elements that satisfy the predicate, the second contains all the ones that don't.
    // partition (>3) [1,3,5,6,3,2,1,0,3,7]  returns ([5,6,7],[1,3,3,2,1,0,3])
    malabi.partition = function(list, fnCondition) {

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

    // TODO:
    var isEqualArray = function(arr1, arr2) {

    };

    var isEqualObject = function(obj1, obj2) {

    };

    // TODO:
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