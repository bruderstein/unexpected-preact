'use strict';

var _unexpectedHtmllikeRawAdapter = require('unexpected-htmllike-raw-adapter');

var _unexpectedHtmllikeRawAdapter2 = _interopRequireDefault(_unexpectedHtmllikeRawAdapter);

var _unexpectedHtmllikePreactAdapter = require('unexpected-htmllike-preact-adapter');

var _unexpectedHtmllikePreactAdapter2 = _interopRequireDefault(_unexpectedHtmllikePreactAdapter);

var _unexpectedHtmllikePreactrenderedAdapter = require('unexpected-htmllike-preactrendered-adapter');

var _unexpectedHtmllikePreactrenderedAdapter2 = _interopRequireDefault(_unexpectedHtmllikePreactrenderedAdapter);

var _deepAssertions = require('./deepAssertions');

var _snapshots = require('../helpers/snapshots');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function installInto(expect) {

  var rawAdapter = new _unexpectedHtmllikeRawAdapter2.default({ convertToString: true, concatTextContent: true });
  var preactAdapter = new _unexpectedHtmllikePreactAdapter2.default({ convertToString: true });
  var renderedPreactAdapter = new _unexpectedHtmllikePreactrenderedAdapter2.default({ convertToString: true, concatTextContent: true });

  expect.addAssertion('<RenderedPreactElement> to match snapshot', function (expect, subject) {
    (0, _snapshots.compareSnapshot)(expect, this.flags, renderedPreactAdapter, subject, _unexpectedHtmllikePreactrenderedAdapter2.default.wrapRootNode(subject));
  });

  expect.addAssertion('<RenderedPreactElementPendingEvent> to match snapshot', function (expect, subject) {
    (0, _deepAssertions.triggerEvent)(expect, subject.renderer, subject.target, subject.eventName, subject.eventArgs);
    expect(subject.renderer, 'to match snapshot');
  });

  expect.addAssertion('<RenderedPreactElement> to satisfy snapshot', function (expect, subject) {
    (0, _snapshots.compareSnapshot)(expect, { satisfy: true }, renderedPreactAdapter, subject, _unexpectedHtmllikePreactrenderedAdapter2.default.wrapRootNode(subject));
  });

  expect.addAssertion('<RenderedPreactElementPendingEvent> to satisfy snapshot', function (expect, subject) {
    (0, _deepAssertions.triggerEvent)(expect, subject.renderer, subject.target, subject.eventName, subject.eventArgs);
    expect(subject.renderer, 'to satisfy snapshot');
  });
}

module.exports = { installInto: installInto };
//# sourceMappingURL=jestSnapshotStandardRendererAssertions.js.map