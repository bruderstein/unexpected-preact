import types from './types/types';
import * as deepAssertions from './assertions/deepAssertions';
import * as deepAgainstRawAssertions from './assertions/deepAgainstRawAssertions';
import jestSnapshotStandardRendererAssertions from './assertions/jestSnapshotStandardRendererAssertions';
import snapshotFunctionType from './types/snapshotFunctionType';
import snapshotFunctionAssertions from './assertions/snapshotFunctionAssertions';


const Preact = require('preact');
Preact.options.debounceRendering = function (fn) { return fn(); };



module.exports = {
  name: 'unexpected-preact',

  installInto(expect) {

    expect.installPlugin(require('magicpen-prism'));

    types.installInto(expect);
    const mainAssertionGenerator = deepAssertions.installInto(expect);
    deepAgainstRawAssertions.installAsAlternative(expect, mainAssertionGenerator);
    jestSnapshotStandardRendererAssertions.installInto(expect);
    snapshotFunctionType.installInto(expect);
    snapshotFunctionAssertions.installInto(expect);
  },

};
