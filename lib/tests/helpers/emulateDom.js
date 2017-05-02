'use strict';

if (typeof document === 'undefined') {

    var jsdom = require('jsdom').jsdom;
    global.document = jsdom('');
    global.window = global.document.defaultView;

    for (var key in global.window) {
        if (!global[key]) {
            global[key] = global.window[key];
        }
    }
    global.Node = global.window.Node;
    global.Text = global.window.Text;
}
//# sourceMappingURL=emulateDom.js.map