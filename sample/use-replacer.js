(function() {
    "use strict";
    const JSON_stringify = require("../lib/index.js").setOption({
        "show-length" : true,
    });;
    var obj = new Function("return this")();
    var replacer = function(key, value, opt) {
        if(opt) {
            // eliminate primitive properties.
            if(value == null || typeof(value) != "object") {
                opt.eliminate = true;
                return undefined;
            }
        }
        return value;
    };
    console.log("global =", JSON_stringify(obj, replacer, 4));
}());


