(function() {
    "use strict";
    var strRepeat = function(s, n) {
        var S = "";
        while(n-- > 0) {
            S += s;
        }
        return S;
    };
    var searchRecursiveRef = function(obj, parents, names) {
        for(var i = 0; i < parents.length; i++) {
            if(obj === parents[i]) {
                return ["$(ROOT)"].concat(names.slice(1, i)).join(".");
            }
        }
        return null;
    };
    var _stringify = function(obj, replacer, space, opts, name, level, parents, names) {
        level = level || 0;
        parents = parents || [];
        names = names || [];
        var qname = "";
        var getRecursiveOpt = function(recursive, opts) {
            var opt = {
                "recursive": recursive,
                "eliminate": opts["eliminate-undefined"]
            };
            if(opts["eliminate-recursive"] && opt.recursive) {
                opt.eliminate = true;
            }
            return opt;
        };
        if(name == null && replacer && typeof(replacer) == 'function') {
            var opt = getRecursiveOpt(false, opts);
            // This replacer call seems like to cause context problem.
            // Auto boxing?
            obj = replacer.call(obj, "", obj, opt);
            if(typeof(obj) === "undefined") {
                return;
            }
        }
        if(name == null) {
            qname = "";
        } else if(typeof(name) == 'number') {
            if(opts["show-index"]) {
                qname = name = "/* [" + name + "] */ ";
            } else {
                qname = name = "";
            }
        } else {
            qname = JSON.stringify(name) + ":";
        }
        var indent = "";
        if(space != null) {
            indent = strRepeat(space, level);
            qname = indent + qname;
        }

        if(obj == null) {
            return qname + "null";
        }

        var originalPath = searchRecursiveRef(obj, parents, names);
        if(originalPath != null) {
            if(opts["show-recursive-reference"]) {
                return qname + "{ /* RECURSIVE REFERENCE to " + originalPath + " */ }";
            }
            return qname + "{}";
        } else if(typeof(obj) == 'function') {
            if(opts["show-function"]) {
                return qname + 'function(){}';
            }
            return null;
        } else if(Array.isArray(obj)) {
            parents.push(obj);
            names.push(name);
            var lines = [];
            obj.forEach(function(value, i) {
                if(typeof(value) == "function") {
                    if(opts["show-function"]) {
                        value = "function(){}";
                    } else {
                        value = null;
                    }
                }
                var recursive = false;
                if(typeof(value) == 'object') {
                    recursive = (searchRecursiveRef(value, parents, names) != null);
                }
                var eliminate = false;
                var opt = getRecursiveOpt(recursive, opts);
                if(replacer) {
                    if(typeof(replacer) == 'function') {
                        value = replacer.call(obj, i, value, opt);
                    }
                }
                eliminate = opt.eliminate;
                if(!eliminate) {
                    lines.push(_stringify(value, replacer, space, opts,
                                i, level + 1, parents, names));
                }
            });
            parents.pop();
            names.pop();

            var lengthDesc = "";
            if(opts["show-length"]) {
                lengthDesc = " /* " + obj.length + " elements */ ";
            }
            if(lines.length == 0) {
                return qname + "[" + lengthDesc + "]";
            }
            if(space == null) {
                return qname + "[" + lengthDesc + lines.join(",") + "]";
            }
            return qname + "[" + lengthDesc + "\n"
                + lines.join(",\n") + "\n" + indent + "]";
        } else if(typeof(obj) == 'object') {
            parents.push(obj);
            names.push(name);
            var lines = [];
            var keys = Object.keys(obj);
            if(opts["sort-keys"]) {
                keys = keys.sort();
            }
            keys.forEach(function(key) {
                var value = obj[key];
                if(typeof(value) == "function") {
                    if(!opts["show-function"]) {
                        return;
                    }
                }
                var recursive = false;
                if(typeof(value) == 'object') {
                    recursive = (searchRecursiveRef(value, parents, names) != null);
                }
                var eliminate = false;
                var opt = getRecursiveOpt(recursive, opts);
                if(replacer) {
                    if(typeof(replacer) == 'function') {
                        value = replacer.call(obj, key, value, opt); 
                    } else if(replacer.indexOf(key) < 0) {
                        value = undefined;
                    }
                }
                eliminate = opt.eliminate;
                if(!eliminate) {
                    lines.push(_stringify(value, replacer, space, opts,
                                key, level + 1, parents, names));
                }
            });
            parents.pop();
            names.pop();

            var lengthDesc = "";
            if(opts["show-length"]) {
                lengthDesc = " /* " + keys.length + " keys */ ";
            }
            if(lines.length == 0) {
                return qname + "{" + lengthDesc + "}";
            }
            if(space == null) {
                return qname + "{" + lengthDesc + lines.join(",") + "}";
            }
            return qname + "{" + lengthDesc + "\n"
                + lines.join(",\n") + "\n" + indent + "}";
        } else {
            return qname + JSON.stringify(obj);
        }
    };
    var defaultOpts = function() {
        return {
            "eliminate-undefined": false,
            "eliminate-recursive": false,
            "show-recursive-reference": true,
            "show-function": false,
            "show-index" : false,
            "show-length" : false,
            "sort-keys" : false
        };
    };
    var mixinOpts = function(dst,src) {
        Object.keys(src).forEach(function(key) {
            if(key in dst) {
                dst[key] = src[key];
            } else {
                throw "Error: unknown option " + key + " is specified.";
            }
        });
    };
    var moduleOpts = defaultOpts();
    var stringify = function(obj, replacer, space, opts) {
        var localOpts = defaultOpts();
        opts = opts || {};
        mixinOpts(localOpts, moduleOpts);
        mixinOpts(localOpts, opts);
        if(replacer != null) {
            if(typeof(replacer) != "function" && !Array.isArray(replacer)) {
                throw "Error: the type of replacer must be function or array.";
            }
        }

        if(space != null) {
            if(typeof(space) == "number") {
                space = strRepeat(" ", space);
            } else if(typeof(space) != "string") {
                throw "Error: the type of space must be number or string.";
            }
        }
        return _stringify(obj, replacer, space, localOpts);
    };
    stringify.setOption = function(opts) {
        opts = opts || {};
        mixinOpts(moduleOpts, opts);
        return module.exports;
    };
    module.exports = stringify;
}());

