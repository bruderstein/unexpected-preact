import Preact, { h } from 'preact';
import ClickCounter from '../ClickCounter';
import Unexpected from 'unexpected';

import UnexpectedPreact from '../../unexpected-preact-non-jest';

const expect = Unexpected.clone().use(UnexpectedPreact);

describe('ClickCounter', function () {

  it('renders with default props', function () {
    // This will fail as we've not included the unexpected-react/jest
    const container = document.createElement('div');
    const instance = Preact.render(<ClickCounter />, container);
    expect(instance, 'to match snapshot');
  });

  it('renders with `when rendered`', function () {
    // This will also fail, but should include the `when rendered` message
    expect(<ClickCounter />, 'when rendered', 'to match snapshot');
  });

  it('renders with default props with to satisfy', function () {
    const container = document.createElement('div');
    const instance = Preact.render(<ClickCounter />, container);
    // This will fail as we've not included the unexpected-react/jest
    expect(instance, 'to satisfy snapshot');
  });

  it('renders with `when rendered to satisfy`', function () {
    // This will also fail, but should include the `when rendered` message
    expect(<ClickCounter />, 'when rendered', 'to satisfy snapshot');
  });

});
