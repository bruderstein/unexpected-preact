import types from './types/types';
import * as deepAssertions from './assertions/deepAssertions';


const Preact = require('preact');
Preact.options.debounceRendering = function (fn) { return fn(); };



module.exports = {
  name: 'unexpected-preact',

  installInto(expect) {

    expect.installPlugin(require('magicpen-prism'));

    types.installInto(expect);
    deepAssertions.installInto(expect);

  },

};
