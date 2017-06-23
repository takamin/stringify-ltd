(function() {
    "use strict";
    const JSON_stringify = require("../index.js");
    var obj = new Function("return this")();
    var replacer = function(key, value) {
        var keyBlackList = ["GLOBAL", "global", "parent", "root", "owner"];
        if(keyBlackList.indexOf(key) >= 0) {
            return undefined;
        }
        return value;
    };
    console.log("global =", JSON_stringify(obj, replacer, 4));
    console.log("global =", JSON.stringify(obj, replacer, 4));
}());
