import types from './types/types';
import * as deepAssertions from './assertions/deepAssertions';


const Preact = require('preact');
Preact.options.debounceRendering = function (fn) { return fn(); };
let uniqueId = 1000;
let IDKEY = '__$$unexpectedPreactId';

if (typeof Symbol === 'function') {
  IDKEY = Symbol('unexpectedPreactId');
}

Preact.options.afterMount = function (component) {
  component[IDKEY] = uniqueId++;
};

Preact.options.afterUpdate = function (component) {
  // TODO: do we actually need to know?
};



module.exports = {
  name: 'unexpected-react',

  installInto(expect) {

    expect.installPlugin(require('magicpen-prism'));

    types.installInto(expect);
    deepAssertions.installInto(expect);

  },

};
