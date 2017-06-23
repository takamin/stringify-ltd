var assert = require("chai").assert;
var JSON_stringify = require("../index");
describe("JSON_stringify", function() {
    it("should convert an object that has circular recursive references to string without exception", function() {
        var crr = { root: null };
        crr.root = crr;
        try {
            JSON.stringify(crr);
            assert(false);
        } catch(err) {
            try {
                var result = JSON_stringify(crr);
                assert.equal("string", typeof(result));
            } catch(err) {
                assert(false);
            }
        }
    });
    describe("should return a same result that original stringify do", function() {
        it("for a value of number", function() {
            var value = 123;
            assert.equal(JSON.stringify(value), JSON_stringify(value));
        });
        it("for a value of string", function() {
            var value = "123";
            assert.equal(JSON.stringify(value), JSON_stringify(value));
        });
        it("for a value of boolean true", function() {
            var value = true;
            assert.equal(JSON.stringify(value), JSON_stringify(value));
        });
        it("for a value of boolean false", function() {
            var value = false;
            assert.equal(JSON.stringify(value), JSON_stringify(value));
        });
        it("for a value of function object", function() {
            var value = function(){return 123;};
            assert.equal(JSON.stringify(value), JSON_stringify(value));
        });
        it("for a value of array", function() {
            var value = [1,"2",function(){}];
            assert.equal(JSON.stringify(value), JSON_stringify(value));
        });
        it("for a value of object", function() {
            var value = {a:1,b:"2",c:function(){}};
            assert.equal(JSON.stringify(value), JSON_stringify(value));
        });
    });
    describe("replacer function", function() {
        it("should be invoked by empty key and whole value at first", function() {
            var targetObject = {};
            var orgReceivedParam = [];
            var yeaReceivedParam = [];

            //Original
            JSON.stringify(targetObject, function(key, value) {
                orgReceivedParam.push({key:key, value:value});
                return value;
            });
            JSON_stringify(targetObject, function(key, value) {
                yeaReceivedParam.push({key:key, value:value});
                return value;
            });
            assert.equal(1, orgReceivedParam.length);
            assert.equal("", orgReceivedParam[0].key);
            assert.deepEqual({}, orgReceivedParam[0].value);

            assert.equal(1, yeaReceivedParam.length,
                "Actual number of replacer invocation");
            
            assert.equal("", yeaReceivedParam[0].key);
            assert.deepEqual({}, yeaReceivedParam[0].value);
            assert.deepEqual(resultsOrg, yeaReceivedParam);
        });
    });
});
