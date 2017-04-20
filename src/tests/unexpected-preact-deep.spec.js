/*
 * A note about these tests:
 *
 * These tests are specifically only testing that the correct calls are being made
  * to unexpected-htmllike, and that the output is correctly returned.
  * They also test the integration with the unexpected-htmllike-rendered-react-adapter
  * There are many, many more cases for specific diffing cases in the tests for
  * `unexpected-htmllike`
 */

const EmulateDom = require('./helpers/emulateDom');

const Unexpected = require('unexpected');
const UnexpectedPreact = require('../unexpected-preact');
const PreactRenderedAdapter = require('unexpected-htmllike-preactrendered-adapter');

const Preact = require('preact');
// Preact.options.debounceRendering = function (fn) { fn(); }
let uniqueId = 1000;

const { h, Component, render } = Preact;
const expect = Unexpected.clone()
    .use(UnexpectedPreact);

expect.output.preferredWidth = 80;


function renderIntoDocument(element) {

  const container = window.document.createElement('div');
  return render(element, container);
}

class CustomComp extends Component {

    constructor() {
        super();
        this.state = {
            clickCount: 0
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        event.preventDefault();  // Used to check that we get the event properly
        this.setState({
            clickCount: this.state.clickCount + 1
        });
    }

    render() {
        let children = null;
        if (this.props.childCount) {
            children = [];
            for(let i = 1; i <= this.props.childCount; ++i) {
                children.push(<span key={i} class={'' + i}>{null}{i}</span>);
            }
        }
        // If onClick was passed, add it as a prop, otherwise, leave it undefined
        const extraProps = {};
        if (this.props.useEvents) {
            extraProps.onClick = this.onClick;
            extraProps['data-click-count'] = this.state.clickCount;
        }

        return (
            <div
                class={this.props.class}
                {...extraProps}
            >
                {children}
            </div>
        );
    }
}

class WrapperComp extends Component {
    render() {
      return <section><CustomComp {...this.props} /></section>;
    }
}

class MyDiv extends Component {
    render() {
        return <div {...this.props}>{this.props.children}</div>;
    }
}

// Dummy assertion for testing async expect.it
expect.addAssertion('<string> to eventually have value <string>', (expect, subject, value) => {

    return expect.promise((resolve, reject) => {

        setTimeout(() => {
            if (subject === value) {
                resolve();
            } else {
                try {
                    expect.fail('Failed');
                } catch (e) {
                    reject(e); // Return the UnexpectedError object
                }
            }
        }, 10);
    });
});

describe('unexpected-react (deep rendering)', () => {

    beforeEach(() => {
        //UnexpectedPreact.clearAll();
    });

    describe('identify', () => {

        it('identifies a rendered ES6 component', () => {

            const component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(<MyDiv class="foo" />));
            expect(component, 'to be a', 'RenderedPreactElementWrapper');
        });

    });

    describe('inspect', () => {

        it('inspects a rendered native element', () => {

            const component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(<MyDiv class="foo" />));

            expect(expect.inspect(component).toString(), 'to equal',
                '<div class="foo" />');
        });

        it('inspects a rendered native element with a string child', () => {

            const component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(<MyDiv class="foo">content</MyDiv>));
            expect(expect.inspect(component).toString(), 'to equal',
                '<div class="foo">content</div>');
        });

        it('inspects a rendered native element with a numeric child', () => {

            const component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(<MyDiv class="foo">{42}</MyDiv>));
            expect(expect.inspect(component).toString(), 'to equal',
                '<div class="foo">42</div>');
        });



        it('inspects a rendered element with children', () => {

            const component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(<MyDiv class="foo"><span class="child1" /></MyDiv>));
            expect(expect.inspect(component).toString(), 'to equal',
                '<div class="foo"><span class="child1" /></div>');
        });

        it('inspects a rendered native element with children and content', () => {

            const component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(
                <MyDiv class="foo">
                    <span class="child1">child content 1</span>
                    <span class="child2">child content 2</span>
                </MyDiv>));
            expect(expect.inspect(component).toString(), 'to equal',
                '<div class="foo">\n' +
                '  <span class="child1">child content 1</span>\n' +
                '  <span class="child2">child content 2</span>\n' +
                '</div>');
        });

        it('inspects a rendered custom component', () => {

            const component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(<CustomComp class="bar" />));
            expect(expect.inspect(component).toString(), 'to equal',
                '<div class="bar" />');
        });

        it('inspects a rendered custom component with a child custom component element', () => {

            const component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(<WrapperComp class="bar" />));
            expect(expect.inspect(component).toString(), 'to equal',
              '<section><CustomComp class="bar"><div class="bar" /></CustomComp></section>'
            );
        });

        it('inspects a component directly with the source component', function () {

          const component = renderIntoDocument(<WrapperComp class="bar" />);
          expect(expect.inspect(component).toString(), 'to equal',
            [
              '<WrapperComp class="bar">',
              '  <section><CustomComp class="bar"><div class="bar" /></CustomComp></section>',
              '</WrapperComp>'
            ].join('\n')
          );
        });

    });

    describe('to have rendered', () => {

        it('matches a rendered simple component', () => {

            const component = renderIntoDocument(<CustomComp class="bar" />);
            return expect(component, 'to have rendered', <div class="bar" />);
        });

        it('matches a rendered deeper component', () => {

            const component = renderIntoDocument(<WrapperComp class="bar" />);
            return expect(component, 'to have rendered',
              <CustomComp class="bar">
                  <div class="bar" />
              </CustomComp>
            );
        });

        it('matches an a component with many children', () => {

          const component = renderIntoDocument(<WrapperComp class="bar" childCount={3} />);
          return expect(component, 'to have rendered',
            <div class="bar">
                <span class="1">1</span>
                <span class="2">2</span>
                <span class="3">3</span>
            </div>
          );
        });

        it('identifies a missing class', () => {

            const component = renderIntoDocument(<CustomComp class="bar foo" />);

            return expect(() => expect(component, 'to have rendered', <div class="blah foo bar" />),
                'to error',
                'expected <CustomComp class="bar foo"><div class="bar foo" /></CustomComp>\n' +
                'to have rendered <div class="blah foo bar" />\n' +
                '\n' +
                '<div class="bar foo" // missing class \'blah\'\n' +
                '/>');
        });

        it('identifies a wrapper', () => {
            const component = renderIntoDocument(<WrapperComp class="bar" childCount={3} />);
            return expect(component, 'to have rendered',
                <section>
                  <span class="1">1</span>
                  <span class="2">2</span>
                  <span class="3">3</span>
                </section>);
        });

        it('updates on change', () => {

            const component = renderIntoDocument(<CustomComp class="bar" useEvents={true} />);
            component.dispatchEvent(new window.Event('click', { bubbles: true, cancellable: true }));

            return expect(component, 'to have rendered',
                    <div class="bar" data-click-count="1" />
            );
        });

        it('matches an expect.it assertion on a prop', () => {

            const component = renderIntoDocument(<CustomComp class="bar" />);

            return expect(component, 'to have rendered',
                <div class={ expect.it('to match', /bar/) } />
            );
        });

        it('highlights a difference with an expect.it assertion on a prop', () => {

            const component = renderIntoDocument(<CustomComp class="bar" />);

            return expect(() => expect(component, 'to have rendered',
                <div class={ expect.it('to match', /foo/) } />
            ), 'to throw',
                'expected <CustomComp class="bar"><div class="bar" /></CustomComp>\n' +
                'to have rendered <div class={expect.it(\'to match\', /foo/)} />\n' +
                '\n' +
                '<div class="bar" // expected \'bar\' to match /foo/\n' +
                '/>');
        });

        it('highlights a difference with an expect.it assertion on content', () =>  {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={1} />);
            return expect(() => expect(component, 'to have rendered',
                <div>
                    <span>{ expect.it('to match', /[a-z]/) }</span>
                </div>
                ), 'to error',
                'expected\n' +
                '<CustomComp class="bar" childCount={1}>\n' +
                '  <div class="bar"><span class="1">1</span></div>\n' +
                '</CustomComp>\n' +
                'to have rendered <div><span>{expect.it(\'to match\', /[a-z]/)}</span></div>\n' +
                '\n' +
                '<div class="bar">\n' +
                '  <span class="1">\n' +
                "    1 // expected '1' to match /[a-z]/\n" +
                '  </span>\n' +
                '</div>');
        });
        
        it('matches an expect.it on JSX content', () => {

            // This is a bit weird, as we don't support [array of children] 'to satisfy' {expect.it(...)}
            // Only <node> 'to satisfy' {expect.it(...)}
            // The output is also wrong here
            // TODO: Fix this in htmllike, so we can expect.it on all the children
            const CustomCompWrapper = () => <CustomComp class="bar" childCount={2} />;
            const component = renderIntoDocument(<CustomCompWrapper />);
            return expect(component, 'to have rendered',
                <CustomComp>
                    { expect.it('to contain', <span class="1" />)
                        .and('to contain', <span class="2" />)}
                </CustomComp>);
        });

        it('highlights a difference with an async expect.it on an attribute', () => {

            const component = renderIntoDocument(<CustomComp class="bar" />);

            return expect(expect(component, 'to have rendered',
                <div class={ expect.it('to eventually have value', 'foo') } />
            ), 'to be rejected with',
                'expected <CustomComp class="bar"><div class="bar" /></CustomComp>\n' +
                'to have rendered <div class={expect.it(\'to eventually have value\', \'foo\')} />\n' +
                '\n' +
                '<div class="bar" // expected \'bar\' to eventually have value \'foo\'\n' +
                '/>');

        });

        it('matches a component that renders multiple numbers', () => {

            const NumberComponent = () => <div>{3}{6}</div>;

            const component = renderIntoDocument(<NumberComponent />);
            expect(component, 'to have rendered', <div>{3}{6}</div>);

        });
        
        it('matches a component that renders single numbers', () => {

            const NumberComponent = () => <div>{3}</div>;

            const component = renderIntoDocument(<NumberComponent />);
            expect(component, 'to have rendered', <div>{3}</div>);

        });

    });

    describe('contains', () => {

        it('finds a deep nested component', () => {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={3} />);
            return expect(component, 'to contain',
                   <div>
                       <span>2</span>
                   </div>
            );

        });

        it('throws an error with the best match when the element is not found', () => {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={3} />);
            return expect(() => expect(component, 'to contain',
                <span class="foo">2</span>
            ), 'to throw',
                'expected\n' +
                '<CustomComp class="bar" childCount={3}>\n' +
                '  <div class="bar">\n' +
                '    <span class="1">1</span><span class="2">2</span><span class="3">3</span>\n' +
                '  </div>\n' +
                '</CustomComp>\n' +
                'to contain <span class="foo">2</span>\n' +
                '\n' +
                'the best match was\n' +
                '<span class="2" // missing class \'foo\'\n' +
                '>\n' +
                '  2\n' +
                '</span>');

        });

        it('throws an error for `not to contain` with the match when the element is found ', () => {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={3} />);
            return expect(() => expect(component, 'not to contain',
                <span class="2">2</span>
                ), 'to throw',
                'expected\n' +
                '<CustomComp class="bar" childCount={3}>\n' +
                '  <div class="bar">\n' +
                '    <span class="1">1</span><span class="2">2</span><span class="3">3</span>\n' +
                '  </div>\n' +
                '</CustomComp>\n' +
                'not to contain <span class="2">2</span>\n' +
                '\n' +
                'but found the following match\n' +
                '<span class="2">2</span>');
        });

        it('returns a rejected promise with the best match when the element is not found with an async expect.it', () => {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={3} />);
            return expect(expect(component, 'to contain',
                <span class={expect.it('to eventually have value', 'foo')}>2</span>
                ), 'to be rejected with',
                'expected\n' +
                '<CustomComp class="bar" childCount={3}>\n' +
                '  <div class="bar">\n' +
                '    <span class="1">1</span><span class="2">2</span><span class="3">3</span>\n' +
                '  </div>\n' +
                '</CustomComp>\n' +
                'to contain <span class={expect.it(\'to eventually have value\', \'foo\')}>2</span>\n' +
                '\n' +
                'the best match was\n' +
                '<span class="2" // expected \'2\' to eventually have value \'foo\'\n' +
                '>\n' +
                '  2\n' +
                '</span>');
        });

    });

    describe('queried for', () => {

        it('finds a rendered component', () => {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={3} />);
            return expect(component, 'queried for', <span class="2" />, 'to have exactly rendered', <span class="2">2</span>);
        });

        it('finds a `contains` query', () => {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={3} />);
            return expect(component, 'queried for', <div class="bar" />, 'to contain', <span class="2">2</span>);
        });
it('errors when the query is not found', () => {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={3}/>);
            return expect(() => expect(component, 'queried for', <div class="not-exist"/>, 'to contain',
                <span class="2">2</span>),
                'to throw',
                'expected\n' +
                '<CustomComp class="bar" childCount={3}>\n' +
                '  <div class="bar">\n' +
                '    <span class="1">1</span><span class="2">2</span><span class="3">3</span>\n' +
                '  </div>\n' +
                '</CustomComp>\n' +
                'queried for <div class="not-exist" /> to contain <span class="2">2</span>\n' +
                '\n' +
                '`queried for` found no match.  The best match was\n' +
                '<div class="bar" // missing class \'not-exist\'\n' +
                '>\n' +
                '  <span class="1">1</span><span class="2">2</span><span class="3">3</span>\n' +
                '</div>');
        });

        it('errors correctly when the following assertion fails', () => {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={3} />);
            return expect(() => expect(component, 'queried for', <span class="2" />, 'to have rendered', <span class="2">foo</span>),
                'to throw',
                'expected\n' +
                '<CustomComp class="bar" childCount={3}>\n' +
                '  <div class="bar">\n' +
                '    <span class="1">1</span><span class="2">2</span><span class="3">3</span>\n' +
                '  </div>\n' +
                '</CustomComp>\n' +
                'queried for <span class="2" /> to have rendered <span class="2">foo</span>\n' +
                '\n' +
                '<span class="2">\n' +
                '  2 // -2\n' +
                '    // +foo\n' +
                '</span>');
        });

        it('finds an element with an async expect.it', () => {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={3} />);
            return expect(component, 'queried for', <div class={ expect.it('to eventually have value', 'bar')} />, 'to contain', <span class="2">2</span>);
        });
        
        it('passes the located component as the resolution of the promise', () => {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={3} />);
            return expect(component, 'queried for', <span class="2" />)
                .then(span => {
                    expect(span, 'to be a', window.HTMLElement);
                    expect(span, 'to satisfy', { className: '2' });
                });
        });
        
        it('passes the located component as the resolution of the promise when the query is async', () => {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={3} />);
            return expect(component, 'queried for', <span class={ expect.it('to eventually have value', '2')} />)
                .then(span => {
                    expect(span, 'to be a', window.HTMLElement)
                      .and('to satisfy', { className: '2' });
                });
        });
        
        it('uses `queryTarget` as the target element', () => {

            const component = renderIntoDocument(<CustomComp class="bar" childCount={3} />);
            return expect(component, 'queried for', <div><span queryTarget class={ expect.it('to eventually have value', '2')} /></div>)
                .then(span => {
                    expect(span, 'to be a', window.HTMLElement)
                      .and('to satisfy', { className: '2' });
                });
        });

    });

    describe('with events', () => {

      //  let ClickableComponent;
      function Message({ msg }) {
        return <span class="message">{msg}</span>;
      }

      class ClickableComponent extends Component {

        constructor() {
          super();
          this.state = {
            clickCount: 1,
            itemClickCount: 1
          };

          this.handleItemClick = this.handleItemClick.bind(this);
          this.handleItemMouseDown = this.handleItemMouseDown.bind(this);
          this.handleMainClick = this.handleMainClick.bind(this);
          this.handleMouseDown = this.handleMouseDown.bind(this);
        }

        handleMainClick() {
          this.setState({
            clickCount: this.state.clickCount + 1
          });
        }

        handleMouseDown(e) {
          this.setState({
            clickCount: this.state.clickCount + ((e && e.clientX) || 1)
          });
        }

        handleItemClick() {
          this.setState({
            itemClickCount: this.state.itemClickCount + 1
          });
        }

        handleItemMouseDown(e) {
          this.setState({
            itemClickCount: this.state.itemClickCount + ((e && e.clientX) || 1)
          });
        }

        render() {
          return (
            <div onClick={this.handleMainClick} onMouseDown={this.handleMouseDown}>
                <span class="main-click">Main clicked {this.state.clickCount}</span>
                <span class="item-click testfoo testbar"
                      onClick={this.handleItemClick}
                      onMouseDown={this.handleItemMouseDown}>Item clicked {this.state.itemClickCount || 0}</span>
                <Message msg="hello world" />
            </div>
          );
        }

      }

        beforeEach(() => {
        });
        
        it('renders a zero initially', () => {

            // This test is (was) failing, when the initial click count is 0. Seems to be a bug in the devtools.
            // Not yet tried updating the devtools.
            const otherComp = renderIntoDocument(<CustomComp />);
          // expect(otherComp, 'to have rendered', <div>Blah</div>)
            const component = renderIntoDocument(<ClickableComponent />);
            expect(component, 'to have rendered',
                <div>
                    <span class="main-click">Main clicked 1</span>
                    <span class="item-click">Item clicked 1</span>
                </div>
                    
            );
        });

        it('calls click on a component using the deep renderer', () => {
            const component = renderIntoDocument(<ClickableComponent />);

            expect(component, 'with event click', 'to have rendered',
                <div>
                    <span class="main-click">Main clicked 2</span>
                </div>
            );
        });
        
        it('calls click on a sub component using the deep renderer', () => {
            const component = renderIntoDocument(<ClickableComponent />);

            expect(component,
              'with event', 'click', 'on', <span class="item-click" />,
              'to have rendered',
              <div>
                <span class="item-click">Item clicked 2</span>
              </div>
            );
        });

        it('triggers multiple events', () => {
            const component = renderIntoDocument(<ClickableComponent />);

            expect(component, 'with event', 'click', 'on', <span class="item-click" />,
                'with event', 'click', 'on', <span class="item-click" />,
                'to have rendered',
                <div>
                    <span class="item-click">Item clicked 3</span>
                </div>);
        });
        
        it('triggers multiple events with eventArgs', () => {
            const component = renderIntoDocument(<ClickableComponent />);

            expect(component, 'with event', 'mousedown', { clientX: 2 },
                'with event', 'mousedown', { clientX: 4 },
                'to have rendered',
                <div>
                    <span class="main-click">Main clicked 7</span>
                </div>);
        });

        it('calls click on a sub component with `to contain`', () => {
            const component = renderIntoDocument(<ClickableComponent />);

            expect(component, 'with event', 'click', 'on', <span class="item-click" />,
                'to contain',
                <span class="item-click">Item clicked 2</span>
            );
        });
        
        it('calls click on a sub component with `not to contain`', () => {
            const component = renderIntoDocument(<ClickableComponent />);

            expect(component, 'with event', 'click', 'on', <span class="item-click" />,
                'not to contain',
                <span class="item-click">Item clicked 1</span>
            );
        });

        it('calls click on a sub component with `not to contain with all children`', () => {
            const component = renderIntoDocument(<ClickableComponent />);

            expect(component, 'with event', 'click', 'on', <span class="item-click" />,
                'not to contain with all children',
                <span class="item-click">Item clicked 1</span>
            );
        });
        
        it('ignores extra classes by default in the `on` clause', () => {

            const component = renderIntoDocument(<ClickableComponent />);
            expect(component, 'with event', 'click', 'on', <span class="item-click testfoo" />,
                'to contain',
                <span class="item-click">Item clicked 2</span>
            );
        });

        it('calls click on a sub component with `queried for`', () => {
            const component = renderIntoDocument(<ClickableComponent />);

            expect(component, 'with event', 'click', 'on', <span class="item-click" />,
                'queried for', <span class="item-click" />,
                'to have rendered',
                <span class="item-click">Item clicked 2</span>
            );
        });
        
        it('calls events with event parameters', () => {
            const component = renderIntoDocument(<ClickableComponent />);

            expect(component, 'with event', 'mousedown', { clientX: 50 }, 'to have rendered',
                <div>
                    <span class="main-click">Main clicked 51</span>
                </div>);
        });

        it('fails with a helpful error message when the target cannot be found', () => {

            const component = renderIntoDocument(<ClickableComponent />);

            expect(() => expect(component, 'with event', 'click', 'on', <span class="not exists" />, 'to have rendered',
                <div>
                    <span>This is never checked</span>
                </div>), 'to throw', /Could not find the target for the event. The best match was/);
        });
        
        it('passes the resulting component as the resolution of the promise', () => {

            const component = renderIntoDocument(<ClickableComponent />);
            
            return expect(component, 'with event', 'click')
                .then(result => {
                    expect(result._component.state, 'to satisfy', { clickCount: 2 });
                });
        });

        it('passes the resulting component as the resolution of the promise with an event argument', () => {

            const component = renderIntoDocument(<ClickableComponent />);

            return expect(component, 'with event', 'mousedown', { clientX: 10 })
                .then(result => {
                    expect(result._component.state, 'to satisfy', { clickCount: 11 });
                });
        });

        it('passes the resulting component as the resolution of the promise when using `on`', () => {

            const component = renderIntoDocument(<ClickableComponent />);

            return expect(component, 'with event', 'click', 'on', <span class="item-click" />)
                .then(result => {
                    expect(result._component.state, 'to satisfy', { itemClickCount: 2 });
                });
        });
        
        
        it('passes the resulting component as the resolution of the promise when using event arguments and `on`', () => {

            const component = renderIntoDocument(<ClickableComponent />);

            return expect(component, 'with event', 'mousedown', { clientX: 10 }, 'on', <span class="item-click" />)
                .then(result => {
                    expect(result._component.state, 'to satisfy', { itemClickCount: 11 });
                });
        });

        it('passes the resulting component as the resolution of the promise with multiple events', () => {

            const component = renderIntoDocument(<ClickableComponent />);

            return expect(component, 'with event', 'mousedown', { clientX: 10 }, 'on', <span class="item-click" />,
            'and with event', 'click')
                .then(result => {
                    expect(result._component.state, 'to satisfy', { clickCount: 12, itemClickCount: 11 });
                });
        });
        
        it('passes the resulting component as the resolution of the promise with multiple events and eventArgs', () => {

            const component = renderIntoDocument(<ClickableComponent />);

            return expect(component, 'with event', 'mousedown', { clientX: 10 }, 'on', <span class="item-click" />,
                'and with event', 'mousedown', { clientX: 15 })
                .then(result => {
                    expect(result._component.state, 'to satisfy', { clickCount: 26, itemClickCount: 11 });
                });
        });

        it('uses the `eventTarget` prop to identify the target for the event', () => {

            const component = renderIntoDocument(<ClickableComponent />);

            return expect(component, 'with event', 'mousedown', { clientX: 10 }, 'on', <div ><span class="item-click" eventTarget /></div>)
                .then(result => {
                    expect(result._component.state, 'to satisfy', { clickCount: 11, itemClickCount: 11 });
                });
        });

        describe('combined with queried for', () => {

            class TodoItem extends Component {
                constructor() {
                    super();
                    this.state = {
                        isCompleted: 'false'
                    };
                    this.onClick = this.onClick.bind(this);
                }

                onClick() {
                    this.setState({
                        isCompleted: 'true'
                    });
                }

                render() {
                    return (<div>
                        <span>{this.props.label}</span>
                        <span>Is complete {this.state.isCompleted}</span>
                        <button onClick={this.onClick}>Click me</button>
                    </div>);
                }
            }

            class TodoList extends Component {

                render() {
                    return (<div>
                        <TodoItem id={1} label="one"/>
                        <TodoItem id={2} label="two"/>
                        <TodoItem id={3} label="three"/>
                    </div>);
                }
            }
            
            it('combines with queried for', () => {

                const component = renderIntoDocument(<TodoList />);
                expect(component,
                  'queried for', <TodoItem id={2}/>,
                  'with event', 'click', 'on', <button />,
                  'to have rendered',
                  <div>
                    <span>two</span>
                    <span>Is complete true</span>
                  </div>
                );

            });

            it('combines with queried for using the result promise', () => {

                const component = renderIntoDocument(<TodoList />);
                return expect(component, 'queried for', <TodoItem id={2}/>)
                    .then(todoItem => {
                        return expect(todoItem.base,
                          'with event', 'click', 'on', <button />,
                          'to have rendered',
                            <div>
                                <span>two</span>
                                <span>Is complete true</span>
                            </div>
                        );
                    });
            });
            
            it('combines with queried for using the result promise and the event promise', () => {

                const component = renderIntoDocument(<TodoList />);
                return expect(component, 'queried for', <TodoItem id={2}/>)
                    .then(todoItem => {
                            return expect(todoItem.base, 'with event', 'click', 'on', <button />);
                        })
                    .then(todoItem => {
                        return expect(todoItem, 'to have rendered',
                            <div>
                                <span>two</span>
                                <span>Is complete true</span>
                            </div>
                        );
                    });
            });

            it('with event followed by queried for returns correct element', () => {

                const component = renderIntoDocument(<TodoList />);
                return expect(component, 
                    'with event click', 'on', <TodoItem id={2}><div><button eventTarget /></div></TodoItem>,
                    'queried for', <TodoItem id={2} />)
                    .then(todoItem => {
                        expect(todoItem.state, 'to satisfy', { isCompleted: 'true' });
                    });
            });
            
            it('with multiple events followed by queried for returns correct element', () => {

                const component = renderIntoDocument(<TodoList />);
                return expect(component,
                    'with event click', 'on', <TodoItem id={2}><div><button eventTarget /></div></TodoItem>,
                    'with event click', 'on', <TodoItem id={1}><div><button eventTarget /></div></TodoItem>,
                    'queried for', <TodoItem id={2} />)
                    .then(todoItem => {
                        expect(todoItem.state, 'to satisfy', { isCompleted: 'true' });
                    });
            });
            
            it('with multiple events followed by queried for for a HTML element returns correct element', () => {

                const component = renderIntoDocument(<TodoList />);
                return expect(component,
                    'with event', 'click', {},
                    'with event', 'click', {},
                    'with event', 'click', {},
                    'queried for', <TodoItem id={2}><div queryTarget /></TodoItem>)
                    .then(div => {
                        expect(div, 'to be a', window.HTMLElement);
                        expect(div, 'to satisfy', { tagName: 'DIV' });
                    });
            });
        });
    });

    describe('when deeply rendered', function () {

        const Stateless = function (props) {
            return <div class="stateless-ftw">Yay</div>;
        };

        it('renders a class component', function () {

            expect(<CustomComp class="foo"/>,
                'when deeply rendered',
                'to have rendered', <div class="foo"></div>
            );
        });

        it('renders a stateless component', function () {

            expect(<Stateless />, 'when deeply rendered', 'to have exactly rendered', <div class="stateless-ftw">Yay</div>);
        });

        it('errors when a stateless component render does not match', function () {

            expect(() => expect(<Stateless />, 'when deeply rendered', 'to have exactly rendered',
                    <div class="stateless-broken">Yay</div>
            ), 'to throw',
            [
                'expected <Stateless />',
                'when deeply rendered to have exactly rendered <div class="stateless-broken">Yay</div>',
                '',
                '<div class="stateless-ftw" // expected \'stateless-ftw\' to equal \'stateless-broken\'',
                '                           //',
                '                           // -stateless-ftw',
                '                           // +stateless-broken',
                '>',
                '  Yay',
                '</div>'
            ].join('\n'));
        });
    });

    describe('to deeply render as', function () {

        const Stateless = function (props) {
            return <div class="stateless-ftw">Yay</div>;
        };

        it('renders a class component', function () {

            expect(<CustomComp class="foo"/>,
                'to deeply render as', <div class="foo"></div>
            );
        });

        it('renders a stateless component', function () {

            expect(<Stateless />, 'to deeply render as', <div class="stateless-ftw">Yay</div>);
        });

        it('errors when a stateless component render does not match', function () {
            expect(() => expect(<Stateless />, 'to deeply render as',
                    <div class="stateless-broken">Yay</div>
            ), 'to throw',
                [
                    'expected <Stateless /> to deeply render as <div class="stateless-broken">Yay</div>',
                    '',
                    '<div class="stateless-ftw" // missing class \'stateless-broken\'',
                    '>',
                    '  Yay',
                    '</div>'
                ].join('\n'));
        });

        it('renders using the exactly flag', function () {
            expect(<CustomComp class="foo"/>,
              'to exactly deeply render as',
              <div class="foo" />
            );
        });

        it('outputs the error when using the exactly flag', function () {
            expect(() => expect(<CustomComp class="foo"/>,
                'to exactly deeply render as',
              <div class="foo bar"/>
            ), 'to throw',
            [
                'expected <CustomComp class="foo" />',
                'to exactly deeply render as <div class="foo bar" />',
                '',
                '<div class="foo" // expected \'foo\' to equal \'foo bar\'',
                '                 //',
                '                 // -foo',
                '                 // +foo bar',
                '/>'
            ].join('\n'));
        });

        it('outputs the error when using the with all classes flag', function () {
            expect(() => expect(<CustomComp class="foo"/>,
              'to deeply render with all classes as',
              <div class="foo bar"/>
            ), 'to throw',
                [
                    'expected <CustomComp class="foo" />',
                    'to deeply render with all classes as <div class="foo bar" />',
                    '',
                    '<div class="foo" // missing class \'bar\'',
                    '/>',
                ].join('\n'));
        });
    });
});
