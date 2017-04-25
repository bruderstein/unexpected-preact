import RawAdapter from 'unexpected-htmllike-raw-adapter';
import PreactElementAdapter from 'unexpected-htmllike-preact-adapter';
import PreactRenderedAdapter from 'unexpected-htmllike-preactrendered-adapter';
import { triggerEvent } from './deepAssertions'
import { compareSnapshot } from '../helpers/snapshots';


function installInto(expect) {

  const rawAdapter = new RawAdapter({ convertToString: true, concatTextContent: true });
  const preactAdapter = new PreactElementAdapter({ convertToString: true });
  const renderedPreactAdapter = new PreactRenderedAdapter({ convertToString: true, concatTextContent: true });

  expect.addAssertion('<RenderedPreactElement> to match snapshot',
    function (expect, subject) {
      compareSnapshot(expect, this.flags, renderedPreactAdapter, subject, PreactRenderedAdapter.wrapRootNode(subject));
    }
  );
  
  expect.addAssertion('<RenderedPreactElementPendingEvent> to match snapshot',
    function (expect, subject) {
      triggerEvent(expect, subject.renderer, subject.target, subject.eventName, subject.eventArgs);
      expect(subject.renderer, 'to match snapshot');
    }
  );
  
  expect.addAssertion('<RenderedPreactElement> to satisfy snapshot',
    function (expect, subject) {
      compareSnapshot(expect, { satisfy: true }, renderedPreactAdapter, subject, PreactRenderedAdapter.wrapRootNode(subject));
    }
  );
  
  expect.addAssertion('<RenderedPreactElementPendingEvent> to satisfy snapshot',
    function (expect, subject) {
      triggerEvent(expect, subject.renderer, subject.target, subject.eventName, subject.eventArgs);
      expect(subject.renderer, 'to satisfy snapshot');
    }
  );
}

module.exports = { installInto };
