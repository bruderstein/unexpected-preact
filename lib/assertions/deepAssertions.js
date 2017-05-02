'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.triggerEvent = exports.installInto = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _unexpectedHtmllike = require('unexpected-htmllike');

var _unexpectedHtmllike2 = _interopRequireDefault(_unexpectedHtmllike);

var _unexpectedHtmllikePreactrenderedAdapter = require('unexpected-htmllike-preactrendered-adapter');

var _unexpectedHtmllikePreactrenderedAdapter2 = _interopRequireDefault(_unexpectedHtmllikePreactrenderedAdapter);

var _unexpectedHtmllikePreactAdapter = require('unexpected-htmllike-preact-adapter');

var _unexpectedHtmllikePreactAdapter2 = _interopRequireDefault(_unexpectedHtmllikePreactAdapter);

var _AssertionGenerator = require('./AssertionGenerator');

var _AssertionGenerator2 = _interopRequireDefault(_AssertionGenerator);

var _preact = require('preact');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// These are events that have a more specific constructor
var eventConstructorMap = {
  animationend: window.AnimationEvent,
  animationiteration: window.AnimationEvent,
  animationstart: window.AnimationEvent,
  beforeunload: window.BeforeUnloadEvent,
  beginEvent: window.TimeEvent,
  blur: window.FocusEvent,
  click: window.MouseEvent,
  compositionend: window.CompositionEvent,
  compositionstart: window.CompositionEvent,
  compositionupdate: window.CompositionEvent,
  contextmenu: window.MouseEvent,
  dblclick: window.MouseEvent,
  DOMActivate: window.UIEvent,
  DOMAttributeNameChanged: window.MutationNameEvent,
  DOMAttrModified: window.MutationEvent,
  DOMCharacterDataModified: window.MutationEvent,
  DOMElementNameChanged: window.MutationNameEvent,
  DOMNodeInserted: window.MutationEvent,
  DOMNodeInsertedIntoDocument: window.MutationEvent,
  DOMNodeRemoved: window.MutationEvent,
  DOMNodeRemovedFromDocument: window.MutationEvent,
  DOMSubtreeModified: window.MutationEvent,
  drag: window.DragEvent,
  dragend: window.DragEvent,
  dragenter: window.DragEvent,
  dragleave: window.DragEvent,
  dragover: window.DragEvent,
  dragstart: window.DragEvent,
  drop: window.DragEvent,
  end: window.SpeechSynthesisEvent,
  error: window.UIEvent,
  focus: window.FocusEvent,
  gamepadconnected: window.GamepadEvent,
  gamepaddisconnected: window.GamepadEvent,
  gotpointercapture: window.PointerEvent,
  hashchange: window.HashChangeEvent,
  lostpointercapture: window.PointerEvent,
  keydown: window.KeyboardEvent,
  keypress: window.KeyboardEvent,
  keyup: window.KeyboardEvent,
  load: window.UIEvent,
  mousedown: window.MouseEvent,
  mouseenter: window.MouseEvent,
  mouseleave: window.MouseEvent,
  mousemove: window.MouseEvent,
  mouseout: window.MouseEvent,
  mouseover: window.MouseEvent,
  mouseup: window.MouseEvent,
  paste: window.ClipboardEvent,
  pointercancel: window.PointerEvent,
  pointerdown: window.PointerEvent,
  pointerenter: window.PointerEvent,
  pointerleave: window.PointerEvent,
  pointermove: window.PointerEvent,
  pointerout: window.PointerEvent,
  pointerover: window.PointerEvent,
  pointerup: window.PointerEvent,
  repeatEvent: window.TimeEvent,
  resize: window.UIEvent,
  scroll: window.UIEvent,
  select: window.UIEvent,
  show: window.MouseEvent,
  SVGAbort: window.SVGEvent,
  SVGError: window.SVGEvent,
  SVGLoad: window.SVGEvent,
  SVGResize: window.SVGEvent,
  SVGScroll: window.SVGEvent,
  SVGUnload: window.SVGEvent,
  SVGZoom: window.SVGZoomEvent,
  touchcancel: window.TouchEvent,
  touchend: window.TouchEvent,
  touchmove: window.TouchEvent,
  touchstart: window.TouchEvent,
  transitionend: window.TransitionEvent,
  unload: window.UIEvent,
  wheel: window.WheelEvent
};

function triggerEvent(expect, component, target, eventName, eventArgs) {
  var targetDOM = component;

  if (targetDOM.hasOwnProperty('props') && targetDOM.hasOwnProperty('context') && typeof targetDOM.setState === 'function') {
    // This is an instance of a component from preact-compat
    targetDOM = targetDOM.base;
  }
  if (target) {
    targetDOM = target.node;
  }

  var EventConstructor = eventConstructorMap[eventName] || window.Event;
  var event = new EventConstructor(eventName, Object.assign({ bubbles: true, cancellable: true, view: window }, eventArgs));
  targetDOM.dispatchEvent(event);
}

function renderIntoDocument(element) {
  var container = window.document.createElement('div');
  return (0, _preact.render)(element, container);
}

function installInto(expect) {

  var assertionGenerator = new _AssertionGenerator2.default({
    ActualAdapter: _unexpectedHtmllikePreactrenderedAdapter2.default,
    QueryAdapter: _unexpectedHtmllikePreactAdapter2.default,
    ExpectedAdapter: _unexpectedHtmllikePreactAdapter2.default,
    actualTypeName: 'RenderedPreactElement',
    queryTypeName: 'PreactElement',
    expectedTypeName: 'PreactElement',
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
      if (result._component) {
        return result._component;
      }
      return result;
    },
    triggerEvent: triggerEvent.bind(null, expect),
    canTriggerEventsOnOutputType: true
  });

  assertionGenerator.installInto(expect);

  var StatelessWrapper = function (_Component) {
    _inherits(StatelessWrapper, _Component);

    function StatelessWrapper() {
      _classCallCheck(this, StatelessWrapper);

      return _possibleConstructorReturn(this, (StatelessWrapper.__proto__ || Object.getPrototypeOf(StatelessWrapper)).apply(this, arguments));
    }

    _createClass(StatelessWrapper, [{
      key: 'render',
      value: function render() {
        return this.props.children;
      }
    }]);

    return StatelessWrapper;
  }(_preact.Component);

  expect.addAssertion('<PreactElement> when [deeply] rendered <assertion?>', function (expect, subject) {
    var component = void 0;
    component = renderIntoDocument(subject);
    return expect.shift(component);
  });

  expect.addAssertion('<PreactElement> to [exactly] [deeply] render [with all children] [with all wrappers] [with all classes] [with all attributes] as <PreactElement>', function (expect, subject, expected) {

    if (this.flags.exactly) {
      return expect(subject, 'when deeply rendered', 'to have exactly rendered', expected);
    }
    return expect(subject, 'when deeply rendered to have rendered [with all children] [with all wrappers] [with all classes] [with all attributes]', expected);
  });
}

exports.installInto = installInto;
exports.triggerEvent = triggerEvent;
//# sourceMappingURL=deepAssertions.js.map