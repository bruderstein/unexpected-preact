import UnexpectedHtmlLike from 'unexpected-htmllike';
import PreactRenderedAdapter from 'unexpected-htmllike-preactrendered-adapter';
import PreactElementAdapter from 'unexpected-htmllike-preact-adapter';
import AssertionGenerator from './AssertionGenerator';
import { h, Component, render } from 'preact';


// These are events that have a more specific constructor
const eventConstructorMap = {
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
  let targetDOM = component;
  if (target) {
    targetDOM = target.node;
  }

  const EventConstructor = eventConstructorMap[eventName] || window.Event;
  let event = new EventConstructor(
    eventName,
    Object.assign({ bubbles: true, cancellable: true, view: window }, eventArgs)
  );
  targetDOM.dispatchEvent(event);
}

function renderIntoDocument(element) {
  const container = window.document.createElement('div');
  return render(element, container);
}

function installInto(expect) {
  
  const assertionGenerator = new AssertionGenerator({
    ActualAdapter: PreactRenderedAdapter,
    QueryAdapter: PreactElementAdapter,
    ExpectedAdapter: PreactElementAdapter,
    actualTypeName: 'RenderedPreactElement',
    queryTypeName: 'PreactElement',
    expectedTypeName: 'PreactElement',
    getRenderOutput: component => {
      if (component &&
          typeof component === 'object' &&
          (component.type === PreactRenderedAdapter.COMPONENT_TYPE ||
          component.type === PreactRenderedAdapter.NODE_TYPE)) {
        return component;
      }
      return PreactRenderedAdapter.wrapRootNode(component);
    },
    actualRenderOutputType: 'RenderedPreactElementWrapper',
    getDiffInputFromRenderOutput: renderOutput => renderOutput,
    rewrapResult: (renderer, target) => target,
    wrapResultForReturn: (component, target) => {
      const result = (target || component);
      if (!result) {
        return result;
      }
      if (result.type === PreactRenderedAdapter.COMPONENT_TYPE) {
        return result.component;
      }
      if (result.type === PreactRenderedAdapter.NODE_TYPE) {
        return result.node;
      }
      return result;
    },
    triggerEvent: triggerEvent.bind(null, expect),
    canTriggerEventsOnOutputType: true
  });

  assertionGenerator.installInto(expect);
  
  class StatelessWrapper extends Component {
      render() {
          return this.props.children;
      }
  }

  expect.addAssertion('<PreactElement> when [deeply] rendered <assertion?>', function (expect, subject) {
      let component;
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

export { installInto, triggerEvent };
