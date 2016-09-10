(function() {
    "use strict";
    const JSON_stringify = require("../lib/index.js");
    var global_object = new Function("return this")();
    console.log("global =", JSON_stringify(global_object, null, 4));
}());
