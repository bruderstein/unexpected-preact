import Preact, { createElement } from 'preact-compat';
import unexpected from 'unexpected';
import unexpectedPreact from '../../unexpected-preact';
import { Multiple, Clicker, StatelessWrapper, Stateless } from '../Components';

const expect = unexpected.clone().use(unexpectedPreact);

const h = createElement;

describe('to render as', function () {
  it('content fail', function () {
    expect(<Clicker />, 'to render as', <div><StatelessWrapper msg="Clicked 0"><span>foo</span></StatelessWrapper></div>)
  });

  it('class fail', function () {
    expect(<Clicker />, 'to render as', <div><StatelessWrapper msg="Clicked 0"><span className="foo">Clicked 0</span></StatelessWrapper></div>)
  });

  it('class fail with wrapper', function () {
    expect(<Clicker />, 'to render as', <div><span className="foo">Clicked 0</span></div>)
  });

  it('all pass', function () {
    expect(<Clicker />, 'to render as', <div><StatelessWrapper msg="Clicked 0"><span className="stateless">Clicked 0</span></StatelessWrapper></div>)
  });

});

describe('with event', function () {
  it('simple pass', function () {
    expect(<Clicker />,
      'when rendered',
      'with event','click',
      'to have rendered',
      <div><StatelessWrapper msg="Clicked 1"><span>Clicked 1</span></StatelessWrapper></div>)
  });

  it('simple pass with wrappers', function () {
    expect(<Clicker />,
      'when rendered',
      'with event','click',
      'to have rendered',
      <span>Clicked 1</span>)
  });

  it('simple pass with wrappers and multiple events', function () {
    expect(<Clicker />,
      'when rendered',
      'with event','click',
      'with event','click',
      'to have rendered',
      <span>Clicked 2</span>)
  });

  it('simple pass with wrappers and multiple events with args', function () {
    expect(<Clicker />,
      'when rendered',
      'with event','mouseDown', { clientX: 5 },
      'with event','click',
      'to have rendered',
      <span>Clicked 6</span>)
  });

  it('with wrappers and multiple events with args (fails)', function () {
    expect(<Clicker />,
      'when rendered',
      'with event','mouseDown', { clientX: 5 },
      'with event','click',
      'to have rendered',
      <span>Clicked 2</span>)
  });

  it('with `on` with attribute match triggers on right component', function () {
    expect(<Multiple />,
      'when rendered',
      'with event','mouseDown', { clientX: 5 }, 'on', <Clicker className="two" />,
      'to have rendered',
      <div>
        <span>Clicked 0</span>
        <span>Clicked 5</span>
      </div>);
  });

  it('with `on` with attribute match triggers on right component (fails)', function () {
    expect(<Multiple />,
      'when rendered',
      'with event','mouseDown', { clientX: 5 }, 'on', <Clicker className="two" />,
      'to have rendered',
      <div>
        <span>Clicked 0</span>
        <span>Clicked 6</span>
      </div>);
  });


});

describe('queried for', function () {
  it('finds a custom component', function () {
    expect(<Multiple />,
      'when rendered',
      'with event','mouseDown', { clientX: 5 }, 'on', <Clicker className="two" />,
      'queried for', <Clicker className="two" />,
      'to have rendered',
      <span>Clicked 5</span>
    );
  });

  it('finds a custom component (fails)', function () {
    expect(<Multiple />,
      'when rendered',
      'with event','mouseDown', { clientX: 5 }, 'on', <Clicker className="two" />,
      'queried for', <Clicker className="two" />,
      'to have rendered',
      <span>Clicked 3 not</span>
    );
  });

  it('finds an HTML element with queryTarget ', function () {
    expect(<Multiple />,
      'when rendered',
      'with event','mouseDown', { clientX: 5 }, 'on', <Clicker className="two" />,
      'queried for', <Clicker className="two"><span queryTarget /></Clicker>,
      'to have exactly rendered',
      <span class="stateless">Clicked 5</span>
    );
  });

  it('finds an HTML element with queryTarget (fails)', function () {
    expect(<Multiple />,
      'when rendered',
      'with event','mouseDown', { clientX: 5 }, 'on', <Clicker className="two" />,
      'queried for', <Clicker className="two"><span queryTarget /></Clicker>,
      'to have exactly rendered',
      <span class="stateless">Clicked 4 not</span>
    );
  });

  it('returns a custom component from the promise (fails)', function () {
    return expect(<Multiple />,
      'when rendered',
      'with event', 'mouseDown', { clientX: 5 }, 'on', <Clicker className="two"/>,
      'queried for', <Clicker className="two"/>)
      .then(comp => {
        expect(comp.state, 'to satisfy', { count: 4 });
      });
  });

  it('returns an HTML element from the promise (fails)', function () {
    return expect(<Multiple />,
      'when rendered',
      'with event', 'mouseDown', { clientX: 5 }, 'on', <Clicker className="two" />,
      'queried for', <Clicker className="two"><span queryTarget /></Clicker>)
      .then(comp => {
        expect(comp.tagName, 'to be', 'SHOULD_BE_SPAN');
      });
  });

  it('triggers an event on a queried for element', function () {
    return expect(<Multiple />,
      'when rendered',
      'queried for', <Clicker className="two"><span /></Clicker>,
      'with event', 'mouseDown', { clientX: 5 },
      'to have rendered',
      <span>Clicked 5</span>
    );
  });
});

describe('Stateless', function () {
  it('renders a stateless component (fails)', function () {
    expect(<StatelessWrapper />, 'to render as', <Stateless msg="cheese"><span>ff</span></Stateless>)
  });

  it('uses the return from a stateless component render (pass)', function () {
    const container = document.createElement('div');
    const instance = Preact.render(<StatelessWrapper msg="cheese"/>, container);
    expect(instance, 'to have rendered', <Stateless><span>cheese</span></Stateless>)
  });
});
