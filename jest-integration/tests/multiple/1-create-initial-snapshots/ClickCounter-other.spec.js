import Preact, {h} from 'preact';
import ClickCounter from '../ClickCounter';
import Unexpected from 'unexpected';

import UnexpectedPreact from '../../unexpected-preact';

const expect = Unexpected.clone().use(UnexpectedPreact);

describe('ClickCounter', function () {

  it('counts a single click', function () {
    // this test has the same name as the test in the other main spec file
    // but this changes the output, to ensure that the snapshots are being stored
    // correctly per test file
    expect(<ClickCounter />,
      'when rendered',
      'with event click',
      'with event click',
      'to match snapshot');
  });

});
