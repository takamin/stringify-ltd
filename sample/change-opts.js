(function() {
    "use strict";
    const JSON_stringify = require("../index.js");
    JSON_stringify.setOption({
        "eliminate-undefined": false,
        "eliminate-recursive": false,
        "show-recursive-reference": true,
        "show-function": true,
        "show-index" : true,
        "show-length" : true,
        "sort-keys" : true
    });
    var obj = new Function("return this")();
    console.log("global =", JSON_stringify(obj, null, 4));
}());

