import Preact, { h } from 'preact';
import ClickCounter from '../ClickCounter';
import Unexpected from 'unexpected';

import UnexpectedPreact from '../../unexpected-preact';

const expect = Unexpected.clone().use(UnexpectedPreact);

describe('ClickCounter', function () {

  it('renders with default props', function () {
    expect(<ClickCounter />, 'when rendered', 'to match snapshot');
  });

  it('counts a single click', function () {
    expect(<ClickCounter />,
      'when rendered',
      'with event', 'click', 'to match snapshot');
  });

  it('counts multiple clicks', function () {
    expect(<ClickCounter />,
      'when rendered',
      'with event', 'click',
      'with event', 'click',
      'with event', 'click',
      'with event', 'click',
      'to match snapshot');
  });

  it('passes multiple snapshots in a single test', function () {
    expect(<ClickCounter />, 'when rendered', 'to match snapshot');
    expect(<ClickCounter />,
      'when rendered',
      'with event', 'click',
      'with event', 'click',
      'with event', 'click',
      'to match snapshot');
  });
});
