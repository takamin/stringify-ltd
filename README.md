yea-stringify
=============

DESCRIPTION
-----------

Yet another `JSON.stringify` implementation.
Some extra features are available.
It can remove the properties by the replacer function and render the circular reference objects.

### Repositories

* [npm](https://www.npmjs.com/package/yea-stringify)
* [GitHub](https://github.com/takamin/yea-stringify)

OPTIONS
-------

Following options are available to change the bahavior.
For detail, see the sample 'Change the rendering options'.

| option                    | Description                                                           | Default setting   |
|:--------------------------|:----------------------------------------------------------------------|:-----------------:|
|`eliminate-undefined`      | The value of undefined will be eliminated                             | false             |
|`eliminate-recursive`      | The circular referencing object will be eliminated                    | false             |
|`show-recursive-reference` | The original object path that is circular referenced will be shown    | true              |
|`show-function`            | The function object apears in list                                    | false             |
|`show-index`               | The index of array apears as comment                                  | false             |
|`show-length`              | The length of array or object's keys apear as comment                 | false             |
|`sort-keys`                | The keys of object are sorted by the name                             | false             |

Using replacer function's extra parameter
-----------------------------------------

Replacer function accepts an extra 3rd parameter.
It is an object that contains following keys to notify the item status or manipurate the behavior.

|Property       | Description                                                           |
|:--------------|:----------------------------------------------------------------------|
| `recursive`   | This indicates the value is circular referencing the other object     |
| `eliminate`   | If the replacer set this true, the key and value will not be listed   |

For detail, see the sample 'Using replacer function'.

SAMPLE
------

## Stringify the circular referencing object

This can stringify the object having circular reference member like `global`.

__[sample/circular-ref.js](sample/circular-ref.js)__

```javascript
(function() {
    "use strict";
    const JSON_stringify = require("yea-stringify");
    var global_object = new Function("return this")();
    console.log("global =", JSON_stringify(global_object, null, 4));
}());
```

outputs:

```
$ node sample/circular-ref.js
global = {
    "global": { /* RECURSIVE REFERENCE to $(ROOT) */ },
    "process": {
        "title": "....",
        "version": "v4.4.1",
        "moduleLoadList": [
            "Binding contextify",
            "Binding natives",
            "NativeModule events",
            "NativeModule buffer",
            "Binding buffer",

            .
            .
            .

        "stdin": {
            "_connecting": false,
            "_hadError": false,
            "_handle": {
                "_externalStream": {},
                "fd": -1,
                "writeQueueSize": 0,
                "owner": { /* RECURSIVE REFERENCE to $(ROOT).process */ },
                "reading": false
            },
```

By default, the circular reference objects are rendered as empty object with comment.
This can be changed by option.

### Change the rendering options

__[sample/change-opts.js](sample/change-opts.js)__

```javascript
(function() {
    "use strict";
    const JSON_stringify = require("yea-stringify");
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
```

outputs:

```
$ node sample/change-opts.js
global = { /* 24 keys */
    "Buffer": function(){},
    "COUNTER_HTTP_CLIENT_REQUEST": function(){},
    "COUNTER_HTTP_CLIENT_RESPONSE": function(){},
    "COUNTER_HTTP_SERVER_REQUEST": function(){},

                .
                .
                .

    "root": { /* RECURSIVE REFERENCE to $(ROOT) */ },
    "setImmediate": function(){},
    "setInterval": function(){},
    "setTimeout": function(){}
}
```

### Using replacer function

In replacer, extra option parameter is available.

__[sample/use-replacer.js](sample/use-replacer.js)__

```javascript
(function() {
    "use strict";
    const JSON_stringify = require("yea-stringify").setOption({
        "show-length" : true,
    });
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
```

outputs:

```
$ node sample/use-replacer.js
global = { /* 24 keys */
    "global": { /* RECURSIVE REFERENCE to $(ROOT) */ },
    "process": { /* 55 keys */
        "moduleLoadList": [ /* 38 elements */ ],
        "versions": { /* 9 keys */ },
        "release": { /* 5 keys */ },
        "argv": [ /* 2 elements */ ],
        "execArgv": [ /* 0 elements */ ],
        "env": { /* 65 keys */ },
        "features": { /* 7 keys */ },
        "_events": { /* 3 keys */
            "SIGWINCH": [ /* 2 elements */ ]
        },
        "config": { /* 2 keys */
            "target_defaults": { /* 5 keys */
                "cflags": [ /* 0 elements */ ],
                "defines": [ /* 0 elements */ ],
                "include_dirs": [ /* 0 elements */ ],
                "libraries": [ /* 0 elements */ ]
            },
            "variables": { /* 34 keys */ }
        },
        "stdout": { /* 30 keys */
            "_handle": { /* 5 keys */
                "_externalStream": { /* 0 keys */ },
                "owner": { /* RECURSIVE REFERENCE to $(ROOT).process */ }
            },
            "_readableState": { /* 21 keys */
                "buffer": [ /* 0 elements */ ]
            },
            "_events": { /* 3 keys */ },
            "_writableState": { /* 23 keys */
                "corkedRequestsFree": { /* 3 keys */
                    "next": { /* 3 keys */ }
                }
            }
        },
        "stderr": { /* 30 keys */
            "_handle": { /* 5 keys */
                "_externalStream": { /* 0 keys */ },
                "owner": { /* RECURSIVE REFERENCE to $(ROOT).process */ }
            },
            "_readableState": { /* 21 keys */
                "buffer": [ /* 0 elements */ ]
            },
            "_events": { /* 3 keys */ },
            "_writableState": { /* 23 keys */
                "corkedRequestsFree": { /* 3 keys */
                    "next": { /* 3 keys */ }
                }
            }
        },
        "stdin": { /* 26 keys */
            "_handle": { /* 6 keys */
                "_externalStream": { /* 0 keys */ },
                "owner": { /* RECURSIVE REFERENCE to $(ROOT).process */ }
            },
            "_readableState": { /* 21 keys */
                "buffer": [ /* 0 elements */ ]
            },
            "_events": { /* 4 keys */ },
            "_writableState": { /* 23 keys */
                "corkedRequestsFree": { /* 3 keys */
                    "next": { /* 3 keys */ }
                }
            }
        },
        "mainModule": { /* 7 keys */
            "exports": { /* 0 keys */ },
            "children": [ /* 1 elements */
                { /* 7 keys */
                    "parent": { /* RECURSIVE REFERENCE to $(ROOT).process */ },
                    "children": [ /* 0 elements */ ],
                    "paths": [ /* 7 elements */ ]
                }
            ],
            "paths": [ /* 7 elements */ ]
        }
    },
    "GLOBAL": { /* RECURSIVE REFERENCE to $(ROOT) */ },
    "root": { /* RECURSIVE REFERENCE to $(ROOT) */ },
    "console": { /* 10 keys */ }
}
```

LICENSE
-------

[MIT](LICENSE)
