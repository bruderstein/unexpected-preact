'use strict';

var _types = require('./types/types');

var _types2 = _interopRequireDefault(_types);

var _deepAssertions = require('./assertions/deepAssertions');

var deepAssertions = _interopRequireWildcard(_deepAssertions);

var _deepAgainstRawAssertions = require('./assertions/deepAgainstRawAssertions');

var deepAgainstRawAssertions = _interopRequireWildcard(_deepAgainstRawAssertions);

var _jestSnapshotStandardRendererAssertions = require('./assertions/jestSnapshotStandardRendererAssertions');

var _jestSnapshotStandardRendererAssertions2 = _interopRequireDefault(_jestSnapshotStandardRendererAssertions);

var _snapshotFunctionType = require('./types/snapshotFunctionType');

var _snapshotFunctionType2 = _interopRequireDefault(_snapshotFunctionType);

var _snapshotFunctionAssertions = require('./assertions/snapshotFunctionAssertions');

var _snapshotFunctionAssertions2 = _interopRequireDefault(_snapshotFunctionAssertions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Preact = require('preact');
Preact.options.debounceRendering = function (fn) {
  return fn();
};

module.exports = {
  name: 'unexpected-preact',

  installInto: function installInto(expect) {

    expect.installPlugin(require('magicpen-prism'));

    _types2.default.installInto(expect);
    var mainAssertionGenerator = deepAssertions.installInto(expect);
    deepAgainstRawAssertions.installAsAlternative(expect, mainAssertionGenerator);
    _jestSnapshotStandardRendererAssertions2.default.installInto(expect);
    _snapshotFunctionType2.default.installInto(expect);
    _snapshotFunctionAssertions2.default.installInto(expect);
  }
};
//# sourceMappingURL=jest.js.map