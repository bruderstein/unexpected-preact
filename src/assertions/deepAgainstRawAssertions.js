import UnexpectedHtmlLike from 'unexpected-htmllike';
import PreactRenderedAdapter from 'unexpected-htmllike-preactrendered-adapter';
import PreactElementAdapter from 'unexpected-htmllike-preact-adapter';
import RawAdapter from 'unexpected-htmllike-raw-adapter';
import Preact from 'preact';
import AssertionGenerator from './AssertionGenerator';
import { triggerEvent } from './deepAssertions';

function getOptions(expect) {
  // Override the classAttributeName as we're always comparing against `class` here
  RawAdapter.prototype.classAttributeName = 'class';

  return {
    ActualAdapter: PreactRenderedAdapter,
    QueryAdapter: PreactElementAdapter,
    ExpectedAdapter: RawAdapter,
    actualTypeName: 'RenderedPreactElement',
    queryTypeName: 'PreactElement',
    expectedTypeName: 'ReactRawObjectElement',
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
  };
}

function installInto(expect) {
  const assertionGenerator = new AssertionGenerator(getOptions(expect));
  assertionGenerator.installInto(expect);
  
  expect.addAssertion('<ReactModule> to have been injected', function (expect) {
    checkAttached(expect);
  });
  
  return assertionGenerator;
}

function installAsAlternative(expect, mainAssertionGenerator) {
  const generatorOptions = getOptions(expect);
  const assertionGenerator = new AssertionGenerator({ mainAssertionGenerator, ...generatorOptions });
  assertionGenerator.installAlternativeExpected(expect);
}

export { installInto, installAsAlternative, triggerEvent };
