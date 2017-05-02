'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.triggerEvent = exports.installAsAlternative = exports.installInto = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _unexpectedHtmllike = require('unexpected-htmllike');

var _unexpectedHtmllike2 = _interopRequireDefault(_unexpectedHtmllike);

var _unexpectedHtmllikePreactrenderedAdapter = require('unexpected-htmllike-preactrendered-adapter');

var _unexpectedHtmllikePreactrenderedAdapter2 = _interopRequireDefault(_unexpectedHtmllikePreactrenderedAdapter);

var _unexpectedHtmllikePreactAdapter = require('unexpected-htmllike-preact-adapter');

var _unexpectedHtmllikePreactAdapter2 = _interopRequireDefault(_unexpectedHtmllikePreactAdapter);

var _unexpectedHtmllikeRawAdapter = require('unexpected-htmllike-raw-adapter');

var _unexpectedHtmllikeRawAdapter2 = _interopRequireDefault(_unexpectedHtmllikeRawAdapter);

var _preact = require('preact');

var _preact2 = _interopRequireDefault(_preact);

var _AssertionGenerator = require('./AssertionGenerator');

var _AssertionGenerator2 = _interopRequireDefault(_AssertionGenerator);

var _deepAssertions = require('./deepAssertions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOptions(expect) {
  // Override the classAttributeName as we're always comparing against `class` here
  _unexpectedHtmllikeRawAdapter2.default.prototype.classAttributeName = 'class';

  return {
    ActualAdapter: _unexpectedHtmllikePreactrenderedAdapter2.default,
    QueryAdapter: _unexpectedHtmllikePreactAdapter2.default,
    ExpectedAdapter: _unexpectedHtmllikeRawAdapter2.default,
    actualTypeName: 'RenderedPreactElement',
    queryTypeName: 'PreactElement',
    expectedTypeName: 'ReactRawObjectElement',
    getRenderOutput: function getRenderOutput(component) {
      if (component && (typeof component === 'undefined' ? 'undefined' : _typeof(component)) === 'object' && (component.type === _unexpectedHtmllikePreactrenderedAdapter2.default.COMPONENT_TYPE || component.type === _unexpectedHtmllikePreactrenderedAdapter2.default.NODE_TYPE)) {
        return component;
      }
      return _unexpectedHtmllikePreactrenderedAdapter2.default.wrapRootNode(component);
    },
    actualRenderOutputType: 'RenderedPreactElementWrapper',
    getDiffInputFromRenderOutput: function getDiffInputFromRenderOutput(renderOutput) {
      return renderOutput;
    },
    rewrapResult: function rewrapResult(renderer, target) {
      return target;
    },
    wrapResultForReturn: function wrapResultForReturn(component, target) {
      var result = target || component;
      if (!result) {
        return result;
      }
      if (result.type === _unexpectedHtmllikePreactrenderedAdapter2.default.COMPONENT_TYPE) {
        return result.component;
      }
      if (result.type === _unexpectedHtmllikePreactrenderedAdapter2.default.NODE_TYPE) {
        return result.node;
      }
      return result;
    },
    triggerEvent: _deepAssertions.triggerEvent.bind(null, expect),
    canTriggerEventsOnOutputType: true
  };
}

function installInto(expect) {
  var assertionGenerator = new _AssertionGenerator2.default(getOptions(expect));
  assertionGenerator.installInto(expect);

  expect.addAssertion('<ReactModule> to have been injected', function (expect) {
    checkAttached(expect);
  });

  return assertionGenerator;
}

function installAsAlternative(expect, mainAssertionGenerator) {
  var generatorOptions = getOptions(expect);
  var assertionGenerator = new _AssertionGenerator2.default(_extends({ mainAssertionGenerator: mainAssertionGenerator }, generatorOptions));
  assertionGenerator.installAlternativeExpected(expect);
}

exports.installInto = installInto;
exports.installAsAlternative = installAsAlternative;
exports.triggerEvent = _deepAssertions.triggerEvent;
//# sourceMappingURL=deepAgainstRawAssertions.js.map