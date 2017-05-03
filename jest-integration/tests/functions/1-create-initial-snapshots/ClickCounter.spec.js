import Preact, { h } from 'preact';
import ClickCounter from '../ClickCounter';
import Unexpected from 'unexpected';

import UnexpectedPreact from '../../unexpected-preact';

const expect = Unexpected.clone().use(UnexpectedPreact);

describe('ClickCounter', function () {

  it('renders with default props', function () {
    expect(<ClickCounter />, 'when rendered', 'to match snapshot');
  });

  // We've removed all other tests, as the onClick won't work without the binding
  // but the point of this test it to check that the test notices the binding is gone
});
