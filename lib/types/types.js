'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _preact = require('preact');

var _unexpectedHtmllike = require('unexpected-htmllike');

var _unexpectedHtmllike2 = _interopRequireDefault(_unexpectedHtmllike);

var _unexpectedHtmllikeRawAdapter = require('unexpected-htmllike-raw-adapter');

var _unexpectedHtmllikeRawAdapter2 = _interopRequireDefault(_unexpectedHtmllikeRawAdapter);

var _unexpectedHtmllikePreactAdapter = require('unexpected-htmllike-preact-adapter');

var _unexpectedHtmllikePreactAdapter2 = _interopRequireDefault(_unexpectedHtmllikePreactAdapter);

var _unexpectedHtmllikePreactrenderedAdapter = require('unexpected-htmllike-preactrendered-adapter');

var _unexpectedHtmllikePreactrenderedAdapter2 = _interopRequireDefault(_unexpectedHtmllikePreactrenderedAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PreactVNode = Object.getPrototypeOf((0, _preact.h)('div'));

function installInto(expect) {

    var preactRenderedAdapter = new _unexpectedHtmllikePreactrenderedAdapter2.default({ includeKeyProp: true, convertToString: true, concatTextContent: true });
    var htmlLikePreactRendered = (0, _unexpectedHtmllike2.default)(preactRenderedAdapter);
    var rawAdapter = new _unexpectedHtmllikeRawAdapter2.default({ convertToString: true, concatTextContent: true });
    var htmlLikeRaw = (0, _unexpectedHtmllike2.default)(rawAdapter);
    var preactAdapter = new _unexpectedHtmllikePreactAdapter2.default({ includeKeyProp: true });
    var htmlLikePreactElement = (0, _unexpectedHtmllike2.default)(preactAdapter);

    expect.addType({

        name: 'RenderedPreactElement',

        base: 'object',
        identify: function identify(value) {
            return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && (_typeof(value._component) === 'object' || _typeof(value.__preact_attr_) === 'object' || value.base && // Following for component instance returned from preact-compat render
            value.hasOwnProperty('props') && value.hasOwnProperty('context') && typeof value.setState === 'function');
        },
        inspect: function inspect(value, depth, output, _inspect) {
            return htmlLikePreactRendered.inspect(_unexpectedHtmllikePreactrenderedAdapter2.default.wrapNode(value), depth, output, _inspect);
        }
    });

    expect.addType({
        name: 'RenderedPreactElementWrapper',

        identify: function identify(value) {
            return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && (value.type === _unexpectedHtmllikePreactrenderedAdapter2.default.COMPONENT_TYPE || value.type === _unexpectedHtmllikePreactrenderedAdapter2.default.NODE_TYPE);
        },
        inspect: function inspect(value, depth, output, _inspect2) {
            return htmlLikePreactRendered.inspect(value, depth, output, _inspect2);
        }
    });

    expect.addType({
        name: 'PreactElement',

        identify: function identify(value) {
            return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && Object.getPrototypeOf(value) === PreactVNode;
        },

        inspect: function inspect(value, depth, output, _inspect3) {
            return htmlLikePreactElement.inspect(value, depth, output, _inspect3);
        }
    });

    expect.addType({
        name: 'ReactRawObjectElement',
        base: 'object',
        identify: function identify(value) {
            return rawAdapter.isRawElement(value);
        },

        inspect: function inspect(value, depth, output, _inspect4) {
            return htmlLikeRaw.inspect(value, depth, output, _inspect4);
        }
    });
}

exports.default = { installInto: installInto };
//# sourceMappingURL=types.js.map