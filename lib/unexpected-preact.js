'use strict';

var _types = require('./types/types');

var _types2 = _interopRequireDefault(_types);

var _deepAssertions = require('./assertions/deepAssertions');

var deepAssertions = _interopRequireWildcard(_deepAssertions);

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
    deepAssertions.installInto(expect);

    expect.addAssertion(['<RenderedPreactElement> to match snapshot', '<RenderedPreactElementPendingEvent> to match snapshot', '<RenderedPreactElement> to satisfy snapshot', '<RenderedPreactElementPendingEvent> to satisfy snapshot'], function (expect) {
      expect.errorMode = 'bubble';
      expect.fail({
        message: function message(output) {
          return output.error('To use snapshot assertions in jest, use \'unexpected-preact/jest\' to require or import unexpected-preact');
        },
        diff: function diff(output) {
          return output.error('To use snapshot assertions in jest, use \'unexpected-preact/jest\' to require or import unexpected-preact');
        }
      });
    });
  }
};
//# sourceMappingURL=unexpected-preact.js.map