var expect = chai.expect;

describe("Malabi-library", function() {
    function sum(a, b) {
        return a + b;
    }
    function sum3(a, b, c) {
        return a + b + c;
    }
    function sumAll() {
        var args = malabi.toArray(arguments);
        return malabi.reduce(args, sum, []);
    }

    describe("first", function() {
        it("first([1, 2, 3]) should return 1", function() {
            expect(malabi.first([1, 2, 3])).to.equal(1);
        });
    });

    describe("last", function() {
        it("last([1, 2, 3]) should return 3", function() {
            expect(malabi.last([1, 2, 3])).to.equal(3);
        });
    });

    describe("rest", function() {
        it("rest([1, 2, 3]) should return [2, 3]", function() {
            expect(malabi.rest([1, 2, 3])).to.eql([2, 3]);
        });
    });


    describe("flatten", function() {
        it("flatten([1, [2, [3]]]) should return [1, 2, 3]", function() {
            expect(malabi.flatten([1, [2, [3]]])).to.eql([1, 2, 3]);
        });

        it("flatten([1, 2, 3]) should return [1, 2, 3]", function() {
            expect(malabi.flatten([1, 2, 3])).to.eql([1, 2, 3]);
        });
    });

    describe("takeWhile", function() {
        it("takeWhile([6,5,4,3,2,1,2,3,4,5,4,3,2,1], function(n) { return (n > 3); }) should return [6, 5, 4]", function() {
            expect(malabi.takeWhile([6,5,4,3,2,1,2,3,4,5,4,3,2,1], function(n) { return (n > 3); })).to.eql([6, 5, 4]);
        });

        it("takeWhile('This is a sentence', function(c) { return (c !== ' '); }) should return 'this'", function() {
            expect(malabi.takeWhile('This is a sentence', function(c) { return (c !== ' '); })).to.equal('This');
        });

    });

    /**
     * Functionalish-functions
     */
    describe("partialLeft", function() {
        it("Makes a partial function with leftmost parameter", function() {
            var myFunc = malabi.partialLeft(malabi.map, [1, 2, 3]);
                expect(myFunc(function(item) { return item * 3; })).to.eql([3, 6, 9]);
        });

        it("Makes a partial function with multiple parameters", function() {
            var sum = function(a, b, c) { return a + b + c; };
            var myFunc = malabi.partialLeft(sum, 3);
            expect(myFunc(5, 7)).to.equal(15);
        });
    });

    describe("partialRight", function() {
        it("Makes a partial function with second parameter", function() {
            var myFunc = malabi.partialRight(malabi.map, function(item) { return item * 3; });
            expect(myFunc([1, 2, 3])).to.eql([3, 6, 9]);
        });
    });

    describe("curry, alias for partialLeft", function() {
        it("Curries with two parameters fn(b)", function() {
            expect(malabi.curry(sum, 5)(3)).to.equal(8);
        });

        it("Curries with three parameters fn(a, b)(c)", function() {
            expect(malabi.curry(sum3, 3, 4)(5)).to.equal(12);
        });
    });

    describe("autoCurry", function() {
        var _sumc = malabi.autoCurry(sum),
            _sumc3 = malabi.autoCurry(sum3),
            _sumcAll = malabi.autoCurry(sumAll);

        xit("Curries with two parameters fn(b)", function() {
            expect(_sumc(5)(3)).to.equal(8);
        });

        xit("Curries with three parameters fn(a, b)(c)", function() {
            expect(_sumc3(3, 4)(5)).to.equal(12);
        });
    });

    describe("bind", function() {
        it("function is bound to different context.", function() {
            var x = 10,
                a = {"x": 101};

            var getX = function() {
                return this.x;
            };
            expect(malabi.bind(a, getX)()).to.equal(101);
        });
    });

    describe("memoize", function() {
        var count = 33;
        it("Fibonacci(" + count + ") should be at least 5 times faster when memoized. ", function() {
            var fibonacci = function(n) {
                if (n < 2) return n;
                return fibonacci(n-2) + fibonacci(n-1);
            };

            var fib_memo = malabi.memoize(function(n) {
                if (n < 2) return n;
                return fib_memo(n - 2) + fib_memo(n - 1);
            });

            expect(malabi.duration(fibonacci, count) > (malabi.duration(fib_memo, count)*5)).to.equal(true);
        });
    });

    describe("Find deep item from object", function() {
        xit("Finds defined item from foo.bar.baz ", function() {
            expect(true).to.eql(false);
        });

        xit("Correctly reports  undefined item from foo.bar.baz ", function() {
            expect(true).to.eql(false);
        });
    });


    describe("map", function() {
        it("map([1, 2, 3], function(value, index) { return value * 3; }) should return [3, 6, 9]", function() {
            expect(malabi.map([1, 2, 3], function(a) { return a * 3; })).to.eql([3, 6, 9]);
        });

        it("map([1, 2, 3], function(value, index) { return index; }) should return [0, 1, 2]", function() {
            expect(malabi.map([1, 2, 3], function(value, index) { return index; })).to.eql([0, 1, 2]);
        });
    });

    describe("filter", function() {
        it("filter([1, 2, 3], function(value, index) { return value * 3; }) should return [3, 6, 9]", function() {
            expect(malabi.filter([1, 2, 3], function(a) { return (a % 2 === 1 ? true : false); })).to.eql([1, 3]);
        });
    });

    describe("reduce", function() {
        it("reduce([1, 2, 3], function(sum, value) { return sum + value; }) should return 6", function() {
            var sum = function(sum, value) { return sum + value; };
            expect(malabi.reduce([1, 2, 3], sum)).to.equal(6);
        });

        it("reduce([[0, 1], [2, 3], [4, 5]], function(a, b) { return a.concat(b); }) should return 6", function() {
            var cat = function(a, b) { return a.concat(b); };
            expect(malabi.reduce([[0, 1], [2, 3], [4, 5]], cat)).to.eql([0, 1, 2, 3, 4, 5]);
        });
    });


    describe("foreach", function() {
        it("Traverses all items", function() {
            var ar = malabi.range(100),
                inc = 0;

            malabi.foreach(ar, function(value, index) {
                expect(value).to.eql(index + 1);
                inc += 1;
            });
            expect(inc).to.eql(ar.length);
        });

        it("Returns both value and index for mapping", function() {
            var ar = [1, 2, 3];
            malabi.foreach(ar, function(value, index) {
                expect(value).to.eql(index + 1);
            });
        });

        xit("Test passing context", function() {

        });
    });

    describe("pluck", function() {
        var set = [
                    {'foo':'bar', 'fox':'bag'},
                    {'foo':'baz', 'foz':'bag'},
                    {'foo':'bax', 'foy':'bag'}
                ];
        it("Should be able to fetch items with property name", function() {
            expect(malabi.pluck(set, 'foo')).to.eql(['bar', 'baz', 'bax']);
        });
    });

    describe("contains", function() {
        var set = ['foo', 'bar', 'baz'];
        it("Finds a value in an array ", function() {
            expect(malabi.contains(set, 'baz')).to.equal(true);
        });
        it("Returns false is value is not found in the array ", function() {
            expect(malabi.contains(set, 'bax')).to.equal(false);
        });
    });

    describe("compose", function() {
        // NOTE: should composition and testing for arguments usage be separate tests?
        it("Should be able to compose two functions", function() {
            var a = function(a) { return a + 1; };
            var b = function(a) { return a + 2; };
            var c = malabi.compose(a, b);

            expect(c(1)).to.equal(4);
        });
    });

    /**
     * Array functions
     */

    describe("range", function() {
        it("range(5) should return [1, 2, 3, 4, 5]", function() {
            expect(malabi.range(5)).to.eql([1, 2, 3, 4, 5]);
        });

        it("range(0) should return []", function() {
            expect(malabi.range(0)).to.eql([]);
        });
    });


    /**
     * Comparisons
     */
    describe("isEqual", function() {
        it("Recognize equal arrays", function() {
            expect(malabi.isEqual([1, 2], [1, 2])).to.eql(true);
        });

        it("Recognize unequal arrays", function() {
            expect(malabi.isEqual([1, 2], [1, 3])).to.equal(false);
        });

        it("Empty array comparison", function() {
            expect(malabi.isEqual([], [])).to.equal(true);
        });

        xit("Empty object comparison", function() {
            expect(malabi.isEqual({}, {})).to.equal(true);
        });

        xit("Recognize similar objects", function() {
            expect(malabi.isEqual({'foo':'bar'}, {'foo':'bar'})).to.equal(true);
        });

        xit("Recognize different objects (same keys, different values)", function() {
            expect(malabi.isEqual({'foo':'bar'}, {'foo':'baz'})).to.equal(true);
        });

        it("isEqual('string', 'string') should return true", function() {
            expect(malabi.isEqual('string', 'string')).to.equal(true);
        });

        it("isEqual(null, null) should return true", function() {
            expect(malabi.isEqual(null, null)).to.equal(true);
        });

        it("isEqual(null, undefined) should return false", function() {
            expect(malabi.isEqual(null, undefined)).to.equal(false);
        });


        it("isEqual(null, '') should return false", function() {
            expect(malabi.isEqual(null, '')).to.equal(false);
        });

        it("isEqual(4, 4) should true", function() {
            expect(malabi.isEqual(4, 4)).to.equal(true);
        });
    });


    /**
     * Type checks and conversions
     */

    describe("toArray", function() {
        it("toArray([1, 2, 3]) should equal [1, 2, 3]", function() {
            expect(malabi.toArray([1, 2, 3])).to.eql([1, 2, 3]);
        });

        it("toArray() should return empty array", function() {
            expect(malabi.toArray()).to.eql([]);
        });
    });

    describe("isNumber", function() {
        it("isNumber(1) to return true", function() {
            expect(malabi.isNumber(1)).to.equal(true);
        });
        it("isNumber('1') to return false", function() {
            expect(malabi.isNumber(1)).to.equal(true);
        });
        it("isNumber('string') to return false", function() {
            expect(malabi.isNumber('string')).to.equal(false);
        });
        it("isNumber(undefined) to return false", function() {
            expect(malabi.isNumber(undefined)).to.equal(false);
        });
        it("isNumber(null) to return false", function() {
            expect(malabi.isNumber(null)).to.equal(false);
        });
    });

    describe("isString", function() {
        it("isString(1) should return false", function() {
            expect(malabi.isString(1)).to.equal(false);
        });

        it("isString('1') should return true", function() {
            expect(malabi.isString('1')).to.equal(true);
        });
    });


    describe("isNumeric", function() {
        it("isNumeric(1) to return true", function() {
            expect(malabi.isNumeric(1)).to.equal(true);
        });
        it("isNumeric('1') to return true", function() {
            expect(malabi.isNumeric('1')).to.equal(true);
        });
        it("isNumeric('string') to return false", function() {
            expect(malabi.isNumeric('string')).to.equal(false);
        });
        it("isNumeric(undefined) to return false", function() {
            expect(malabi.isNumeric(undefined)).to.equal(false);
        });
        it("isNumeric(null) to return false", function() {
            expect(malabi.isNumeric(null)).to.equal(false);
        });

    });


    // TEST: ['a', null, 1, '1', undefined, [], {}, function() {}]
    describe("isArray", function() {
        it("Should recognize an empty array", function() {
            expect(malabi.isArray([])).to.equal(true);
        });

        it("Should recognize a non-empty array", function() {
            expect(malabi.isArray([1])).to.equal(true);
            expect(malabi.isArray([1, 2, 3, 'a'])).to.equal(true);
        });

        it("Should return false for undefined", function() {
            expect(malabi.isArray(undefined)).to.equal(false);
        });

        it("Should return false for null", function() {
            expect(malabi.isArray(null)).to.equal(false);
        });

        it("Should return false for strings", function() {
            expect(malabi.isArray('string')).to.equal(false);
        });

        it("Should return false for objects", function() {
            expect(malabi.isArray({})).to.equal(false);
            expect(malabi.isArray({'joo':'ei'})).to.equal(false);
        });

        it("Should return false for function", function() {
            expect(malabi.isArray(function() { return false; })).to.equal(false);
        });
    });


    describe("isUndefined", function() {
        it("Should return true for undefined", function() {
            expect(malabi.isUndefined(undefined)).to.equal(true);
        });

        it("Should recognize return false on empty array", function() {
            expect(malabi.isUndefined([])).to.equal(false);
        });

        it("Should recognize a non-empty array", function() {
            expect(malabi.isUndefined([1])).to.equal(false);
            expect(malabi.isUndefined([1, 2, 3, 'a'])).to.equal(false);
        });

        it("Should return false for null", function() {
            expect(malabi.isUndefined(null)).to.equal(false);
        });

        it("Should return false for strings", function() {
            expect(malabi.isUndefined('string')).to.equal(false);
        });

        it("Should return false for objects", function() {
            expect(malabi.isUndefined({})).to.equal(false);
            expect(malabi.isUndefined({'joo':'ei'})).to.equal(false);
        });

        it("Should return false for function", function() {
            expect(malabi.isUndefined(function() { return false; })).to.equal(false);
        });
    });


});