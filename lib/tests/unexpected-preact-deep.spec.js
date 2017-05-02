'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * A note about these tests:
 *
 * These tests are specifically only testing that the correct calls are being made
  * to unexpected-htmllike, and that the output is correctly returned.
  * They also test the integration with the unexpected-htmllike-rendered-react-adapter
  * There are many, many more cases for specific diffing cases in the tests for
  * `unexpected-htmllike`
 */

var EmulateDom = require('./helpers/emulateDom');

var Unexpected = require('unexpected');
var UnexpectedPreact = require('../unexpected-preact');
var PreactRenderedAdapter = require('unexpected-htmllike-preactrendered-adapter');

var Preact = require('preact');
var PreactCompat = require('preact-compat');

var expect = Unexpected.clone().use(UnexpectedPreact);

expect.output.preferredWidth = 80;

/**
 * Generates the tests for a given preact setup.
 * This encapsulates all the tests, and enables them to all be run both with praect and preact-compat
 * @param h
 * @param Component
 * @param render
 * @param testGroupDescription
 */
function runTests(_ref, testGroupDescription) {
  var h = _ref.h,
      Component = _ref.Component,
      render = _ref.render;


  function renderIntoDocument(element) {

    var container = window.document.createElement('div');
    return render(element, container);
  }

  var CustomComp = function (_Component) {
    _inherits(CustomComp, _Component);

    function CustomComp() {
      _classCallCheck(this, CustomComp);

      var _this = _possibleConstructorReturn(this, (CustomComp.__proto__ || Object.getPrototypeOf(CustomComp)).call(this));

      _this.state = {
        clickCount: 0
      };
      _this.onClick = _this.onClick.bind(_this);
      return _this;
    }

    _createClass(CustomComp, [{
      key: 'onClick',
      value: function onClick(event) {
        event.preventDefault(); // Used to check that we get the event properly
        this.setState({
          clickCount: this.state.clickCount + 1
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var children = null;
        if (this.props.childCount) {
          children = [];
          for (var i = 1; i <= this.props.childCount; ++i) {
            children.push(h(
              'span',
              { key: i, 'class': '' + i },
              null,
              i
            ));
          }
        }
        // If onClick was passed, add it as a prop, otherwise, leave it undefined
        var extraProps = {};
        if (this.props.useEvents) {
          extraProps.onClick = this.onClick;
          extraProps['data-click-count'] = this.state.clickCount;
        }

        return h(
          'div',
          _extends({
            'class': this.props.class
          }, extraProps),
          children
        );
      }
    }]);

    return CustomComp;
  }(Component);

  var WrapperComp = function (_Component2) {
    _inherits(WrapperComp, _Component2);

    function WrapperComp() {
      _classCallCheck(this, WrapperComp);

      return _possibleConstructorReturn(this, (WrapperComp.__proto__ || Object.getPrototypeOf(WrapperComp)).apply(this, arguments));
    }

    _createClass(WrapperComp, [{
      key: 'render',
      value: function render() {
        return h(
          'section',
          null,
          h(CustomComp, this.props)
        );
      }
    }]);

    return WrapperComp;
  }(Component);

  var MyDiv = function (_Component3) {
    _inherits(MyDiv, _Component3);

    function MyDiv() {
      _classCallCheck(this, MyDiv);

      return _possibleConstructorReturn(this, (MyDiv.__proto__ || Object.getPrototypeOf(MyDiv)).apply(this, arguments));
    }

    _createClass(MyDiv, [{
      key: 'render',
      value: function render() {
        return h(
          'div',
          this.props,
          this.props.children
        );
      }
    }]);

    return MyDiv;
  }(Component);

  // Dummy assertion for testing async expect.it


  expect.addAssertion('<string> to eventually have value <string>', function (expect, subject, value) {

    return expect.promise(function (resolve, reject) {

      setTimeout(function () {
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

  describe('unexpected-react (' + testGroupDescription + ')', function () {

    beforeEach(function () {
      //UnexpectedPreact.clearAll();
    });

    describe('identify', function () {

      it('identifies a rendered ES6 component', function () {

        var component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(h(MyDiv, { 'class': 'foo' })));
        expect(component, 'to be a', 'RenderedPreactElementWrapper');
      });
    });

    describe('inspect', function () {

      it('inspects a rendered native element', function () {

        var component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(h(MyDiv, { 'class': 'foo' })));

        expect(expect.inspect(component).toString(), 'to equal', '<div class="foo" />');
      });

      it('inspects a rendered native element with a string child', function () {

        var component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(h(
          MyDiv,
          { 'class': 'foo' },
          'content'
        )));
        expect(expect.inspect(component).toString(), 'to equal', '<div class="foo">content</div>');
      });

      it('inspects a rendered native element with a numeric child', function () {

        var component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(h(
          MyDiv,
          { 'class': 'foo' },
          42
        )));
        expect(expect.inspect(component).toString(), 'to equal', '<div class="foo">42</div>');
      });

      it('inspects a rendered element with children', function () {

        var component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(h(
          MyDiv,
          { 'class': 'foo' },
          h('span', {
            'class': 'child1' })
        )));
        expect(expect.inspect(component).toString(), 'to equal', '<div class="foo"><span class="child1" /></div>');
      });

      it('inspects a rendered native element with children and content', function () {

        var component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(h(
          MyDiv,
          { 'class': 'foo' },
          h(
            'span',
            { 'class': 'child1' },
            'child content 1'
          ),
          h(
            'span',
            { 'class': 'child2' },
            'child content 2'
          )
        )));
        expect(expect.inspect(component).toString(), 'to equal', '<div class="foo">\n' + '  <span class="child1">child content 1</span>\n' + '  <span class="child2">child content 2</span>\n' + '</div>');
      });

      it('inspects a rendered custom component', function () {

        var component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(h(CustomComp, { 'class': 'bar' })));
        expect(expect.inspect(component).toString(), 'to equal', '<div class="bar" />');
      });

      it('inspects a rendered custom component with a child custom component element', function () {

        var component = PreactRenderedAdapter.wrapRootNode(renderIntoDocument(h(WrapperComp, { 'class': 'bar' })));
        expect(expect.inspect(component).toString(), 'to equal', '<section><CustomComp class="bar"><div class="bar" /></CustomComp></section>');
      });

      it('inspects a component directly with the source component', function () {

        var component = renderIntoDocument(h(WrapperComp, { 'class': 'bar' }));
        expect(expect.inspect(component).toString(), 'to equal', ['<WrapperComp class="bar">', '  <section><CustomComp class="bar"><div class="bar" /></CustomComp></section>', '</WrapperComp>'].join('\n'));
      });
    });

    describe('to have rendered', function () {

      it('matches a rendered simple component', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar' }));
        return expect(component, 'to have rendered', h('div', { 'class': 'bar' }));
      });

      it('matches a rendered deeper component', function () {

        var component = renderIntoDocument(h(WrapperComp, { 'class': 'bar' }));
        return expect(component, 'to have rendered', h(
          CustomComp,
          { 'class': 'bar' },
          h('div', { 'class': 'bar' })
        ));
      });

      it('matches an a component with many children', function () {

        var component = renderIntoDocument(h(WrapperComp, { 'class': 'bar', childCount: 3 }));
        return expect(component, 'to have rendered', h(
          'div',
          { 'class': 'bar' },
          h(
            'span',
            { 'class': '1' },
            '1'
          ),
          h(
            'span',
            { 'class': '2' },
            '2'
          ),
          h(
            'span',
            { 'class': '3' },
            '3'
          )
        ));
      });

      it('identifies a missing class', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar foo' }));

        return expect(function () {
          return expect(component, 'to have rendered', h('div', { 'class': 'blah foo bar' }));
        }, 'to error', 'expected <CustomComp class="bar foo"><div class="bar foo" /></CustomComp>\n' + 'to have rendered <div class="blah foo bar" />\n' + '\n' + '<div class="bar foo" // missing class \'blah\'\n' + '/>');
      });

      it('identifies a wrapper', function () {
        var component = renderIntoDocument(h(WrapperComp, { 'class': 'bar', childCount: 3 }));
        return expect(component, 'to have rendered', h(
          'section',
          null,
          h(
            'span',
            { 'class': '1' },
            '1'
          ),
          h(
            'span',
            { 'class': '2' },
            '2'
          ),
          h(
            'span',
            { 'class': '3' },
            '3'
          )
        ));
      });

      it('updates on change', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', useEvents: true }));
        var event = new window.Event('click', { bubbles: true, cancellable: true });
        if (component.dispatchEvent) {
          component.dispatchEvent(event);
        } else {
          // For preact-compat, the return value of render is the component instance, not the DOM node
          component.base.dispatchEvent(event);
        }

        return expect(component, 'to have rendered', h('div', { 'class': 'bar', 'data-click-count': 1 }));
      });

      it('matches an expect.it assertion on a prop', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar' }));

        return expect(component, 'to have rendered', h('div', { 'class': expect.it('to match', /bar/) }));
      });

      it('highlights a difference with an expect.it assertion on a prop', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar' }));

        return expect(function () {
          return expect(component, 'to have rendered', h('div', { 'class': expect.it('to match', /foo/) }));
        }, 'to throw', 'expected <CustomComp class="bar"><div class="bar" /></CustomComp>\n' + 'to have rendered <div class={expect.it(\'to match\', /foo/)} />\n' + '\n' + '<div class="bar" // expected \'bar\' to match /foo/\n' + '/>');
      });

      it('highlights a difference with an expect.it assertion on content', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 1 }));
        return expect(function () {
          return expect(component, 'to have rendered', h(
            'div',
            null,
            h(
              'span',
              null,
              expect.it('to match', /[a-z]/)
            )
          ));
        }, 'to error', 'expected\n' + '<CustomComp class="bar" childCount={1}>\n' + '  <div class="bar"><span key={1} class="1">1</span></div>\n' + '</CustomComp>\n' + 'to have rendered <div><span>{expect.it(\'to match\', /[a-z]/)}</span></div>\n' + '\n' + '<div class="bar">\n' + '  <span key={1} class="1">\n' + "    1 // expected '1' to match /[a-z]/\n" + '  </span>\n' + '</div>');
      });

      it('matches an expect.it on JSX content', function () {

        // This is a bit weird, as we don't support [array of children] 'to satisfy' {expect.it(...)}
        // Only <node> 'to satisfy' {expect.it(...)}
        // The output is also wrong here
        // TODO: Fix this in htmllike, so we can expect.it on all the children
        var CustomCompWrapper = function CustomCompWrapper() {
          return h(CustomComp, { 'class': 'bar', childCount: 2 });
        };
        var component = renderIntoDocument(h(CustomCompWrapper, null));
        return expect(component, 'to have rendered', h(
          CustomComp,
          null,
          expect.it('to contain', h('span', { 'class': '1' })).and('to contain', h('span', { 'class': '2' }))
        ));
      });

      it('highlights a difference with an async expect.it on an attribute', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar' }));
        return expect(expect(component, 'to have rendered', h('div', { 'class': expect.it('to eventually have value', 'foo') })), 'to be rejected with', 'expected <CustomComp class="bar"><div class="bar" /></CustomComp>\n' + 'to have rendered <div class={expect.it(\'to eventually have value\', \'foo\')} />\n' + '\n' + '<div class="bar" // expected \'bar\' to eventually have value \'foo\'\n' + '/>');
      });

      it('matches a component that renders multiple numbers', function () {

        var NumberComponent = function NumberComponent() {
          return h(
            'div',
            null,
            3,
            6
          );
        };

        var component = renderIntoDocument(h(NumberComponent, null));
        expect(component, 'to have rendered', h(
          'div',
          null,
          3,
          6
        ));
      });

      it('matches a component that renders single numbers', function () {

        var NumberComponent = function NumberComponent() {
          return h(
            'div',
            null,
            3
          );
        };

        var component = renderIntoDocument(h(NumberComponent, null));
        expect(component, 'to have rendered', h(
          'div',
          null,
          3
        ));
      });
    });

    describe('contains', function () {

      it('finds a deep nested component', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 3 }));
        return expect(component, 'to contain', h(
          'div',
          null,
          h(
            'span',
            null,
            '2'
          )
        ));
      });

      it('throws an error with the best match when the element is not found', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 3 }));
        return expect(function () {
          return expect(component, 'to contain', h(
            'span',
            { 'class': 'foo' },
            '2'
          ));
        }, 'to throw', 'expected\n' + '<CustomComp class="bar" childCount={3}>\n' + '  <div class="bar">\n' + '    <span key={1} class="1">1</span>\n' + '    <span key={2} class="2">2</span>\n' + '    <span key={3} class="3">3</span>\n' + '  </div>\n' + '</CustomComp>\n' + 'to contain <span class="foo">2</span>\n' + '\n' + 'the best match was\n' + '<span key={2} class="2" // missing class \'foo\'\n' + '>\n' + '  2\n' + '</span>');
      });

      it('throws an error for `not to contain` with the match when the element is found ', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 3 }));
        return expect(function () {
          return expect(component, 'not to contain', h(
            'span',
            { 'class': '2' },
            '2'
          ));
        }, 'to throw', 'expected\n' + '<CustomComp class="bar" childCount={3}>\n' + '  <div class="bar">\n' + '    <span key={1} class="1">1</span>\n' + '    <span key={2} class="2">2</span>\n' + '    <span key={3} class="3">3</span>\n' + '  </div>\n' + '</CustomComp>\n' + 'not to contain <span class="2">2</span>\n' + '\n' + 'but found the following match\n' + '<span key={2} class="2">2</span>');
      });

      it('returns a rejected promise with the best match when the element is not found with an async expect.it', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 3 }));
        return expect(expect(component, 'to contain', h(
          'span',
          { 'class': expect.it('to eventually have value', 'foo') },
          '2'
        )), 'to be rejected with', 'expected\n' + '<CustomComp class="bar" childCount={3}>\n' + '  <div class="bar">\n' + '    <span key={1} class="1">1</span>\n' + '    <span key={2} class="2">2</span>\n' + '    <span key={3} class="3">3</span>\n' + '  </div>\n' + '</CustomComp>\n' + 'to contain <span class={expect.it(\'to eventually have value\', \'foo\')}>2</span>\n' + '\n' + 'the best match was\n' + '<span key={2} class="2" // expected \'2\' to eventually have value \'foo\'\n' + '>\n' + '  2\n' + '</span>');
      });
    });

    describe('queried for', function () {

      it('finds a rendered component', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 3 }));
        return expect(component, 'queried for', h('span', { 'class': '2' }), 'to have exactly rendered', h(
          'span',
          { key: 2,
            'class': '2' },
          '2'
        ));
      });

      it('finds a `contains` query', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 3 }));
        return expect(component, 'queried for', h('div', { 'class': 'bar' }), 'to contain', h(
          'span',
          { 'class': '2' },
          '2'
        ));
      });
      it('errors when the query is not found', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 3 }));
        return expect(function () {
          return expect(component, 'queried for', h('div', { 'class': 'not-exist' }), 'to contain', h(
            'span',
            { 'class': '2' },
            '2'
          ));
        }, 'to throw', 'expected\n' + '<CustomComp class="bar" childCount={3}>\n' + '  <div class="bar">\n' + '    <span key={1} class="1">1</span>\n' + '    <span key={2} class="2">2</span>\n' + '    <span key={3} class="3">3</span>\n' + '  </div>\n' + '</CustomComp>\n' + 'queried for <div class="not-exist" /> to contain <span class="2">2</span>\n' + '\n' + '`queried for` found no match.  The best match was\n' + '<div class="bar" // missing class \'not-exist\'\n' + '>\n' + '  <span key={1} class="1">1</span>\n' + '  <span key={2} class="2">2</span>\n' + '  <span key={3} class="3">3</span>\n' + '</div>');
      });

      it('errors correctly when the following assertion fails', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 3 }));
        return expect(function () {
          return expect(component, 'queried for', h('span', { 'class': '2' }), 'to have rendered', h(
            'span',
            {
              'class': '2' },
            'foo'
          ));
        }, 'to throw', 'expected\n' + '<CustomComp class="bar" childCount={3}>\n' + '  <div class="bar">\n' + '    <span key={1} class="1">1</span>\n' + '    <span key={2} class="2">2</span>\n' + '    <span key={3} class="3">3</span>\n' + '  </div>\n' + '</CustomComp>\n' + 'queried for <span class="2" /> to have rendered <span class="2">foo</span>\n' + '\n' + '<span key={2} class="2">\n' + '  2 // -2\n' + '    // +foo\n' + '</span>');
      });

      it('finds an element with an async expect.it', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 3 }));
        return expect(component, 'queried for', h('div', {
          'class': expect.it('to eventually have value', 'bar') }), 'to contain', h(
          'span',
          { 'class': '2' },
          '2'
        ));
      });

      it('passes the located component as the resolution of the promise', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 3 }));
        return expect(component, 'queried for', h('span', { 'class': '2' })).then(function (span) {
          expect(span, 'to be a', window.HTMLElement);
          expect(span, 'to satisfy', { className: '2' });
        });
      });

      it('passes the located component as the resolution of the promise when the query is async', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 3 }));
        return expect(component, 'queried for', h('span', { 'class': expect.it('to eventually have value', '2') })).then(function (span) {
          expect(span, 'to be a', window.HTMLElement).and('to satisfy', { className: '2' });
        });
      });

      it('uses `queryTarget` as the target element', function () {

        var component = renderIntoDocument(h(CustomComp, { 'class': 'bar', childCount: 3 }));
        return expect(component, 'queried for', h(
          'div',
          null,
          h('span', { queryTarget: true,
            'class': expect.it('to eventually have value', '2') })
        )).then(function (span) {
          expect(span, 'to be a', window.HTMLElement).and('to satisfy', { className: '2' });
        });
      });
    });

    describe('with events', function () {

      //  let ClickableComponent;
      function Message(_ref2) {
        var msg = _ref2.msg;

        return h(
          'span',
          { 'class': 'message' },
          msg
        );
      }

      var ClickableComponent = function (_Component4) {
        _inherits(ClickableComponent, _Component4);

        function ClickableComponent() {
          _classCallCheck(this, ClickableComponent);

          var _this4 = _possibleConstructorReturn(this, (ClickableComponent.__proto__ || Object.getPrototypeOf(ClickableComponent)).call(this));

          _this4.state = {
            clickCount: 1,
            itemClickCount: 1
          };

          _this4.handleItemClick = _this4.handleItemClick.bind(_this4);
          _this4.handleItemMouseDown = _this4.handleItemMouseDown.bind(_this4);
          _this4.handleMainClick = _this4.handleMainClick.bind(_this4);
          _this4.handleMouseDown = _this4.handleMouseDown.bind(_this4);
          return _this4;
        }

        _createClass(ClickableComponent, [{
          key: 'handleMainClick',
          value: function handleMainClick() {
            this.setState({
              clickCount: this.state.clickCount + 1
            });
          }
        }, {
          key: 'handleMouseDown',
          value: function handleMouseDown(e) {
            this.setState({
              clickCount: this.state.clickCount + (e && e.clientX || 1)
            });
          }
        }, {
          key: 'handleItemClick',
          value: function handleItemClick() {
            this.setState({
              itemClickCount: this.state.itemClickCount + 1
            });
          }
        }, {
          key: 'handleItemMouseDown',
          value: function handleItemMouseDown(e) {
            this.setState({
              itemClickCount: this.state.itemClickCount + (e && e.clientX || 1)
            });
          }
        }, {
          key: 'render',
          value: function render() {
            return h(
              'div',
              { onClick: this.handleMainClick, onMouseDown: this.handleMouseDown },
              h(
                'span',
                { 'class': 'main-click' },
                'Main clicked ',
                this.state.clickCount
              ),
              h(
                'span',
                { 'class': 'item-click testfoo testbar',
                  onClick: this.handleItemClick,
                  onMouseDown: this.handleItemMouseDown },
                'Item clicked ',
                this.state.itemClickCount || 0
              ),
              h(Message, { msg: 'hello world' })
            );
          }
        }]);

        return ClickableComponent;
      }(Component);

      beforeEach(function () {});

      it('renders a zero initially', function () {

        // This test is (was) failing, when the initial click count is 0. Seems to be a bug in the devtools.
        // Not yet tried updating the devtools.
        var otherComp = renderIntoDocument(h(CustomComp, null));
        // expect(otherComp, 'to have rendered', <div>Blah</div>)
        var component = renderIntoDocument(h(ClickableComponent, null));
        expect(component, 'to have rendered', h(
          'div',
          null,
          h(
            'span',
            { 'class': 'main-click' },
            'Main clicked 1'
          ),
          h(
            'span',
            { 'class': 'item-click' },
            'Item clicked 1'
          )
        ));
      });

      it('calls click on a component using the deep renderer', function () {
        var component = renderIntoDocument(h(ClickableComponent, null));

        expect(component, 'with event click', 'to have rendered', h(
          'div',
          null,
          h(
            'span',
            { 'class': 'main-click' },
            'Main clicked 2'
          )
        ));
      });

      it('calls click on a sub component using the deep renderer', function () {
        var component = renderIntoDocument(h(ClickableComponent, null));

        expect(component, 'with event', 'click', 'on', h('span', { 'class': 'item-click' }), 'to have rendered', h(
          'div',
          null,
          h(
            'span',
            { 'class': 'item-click' },
            'Item clicked 2'
          )
        ));
      });

      it('triggers multiple events', function () {
        var component = renderIntoDocument(h(ClickableComponent, null));

        expect(component, 'with event', 'click', 'on', h('span', { 'class': 'item-click' }), 'with event', 'click', 'on', h('span', { 'class': 'item-click' }), 'to have rendered', h(
          'div',
          null,
          h(
            'span',
            { 'class': 'item-click' },
            'Item clicked 3'
          )
        ));
      });

      it('triggers multiple events with eventArgs', function () {
        var component = renderIntoDocument(h(ClickableComponent, null));

        expect(component, 'with event', 'mousedown', { clientX: 2 }, 'with event', 'mousedown', { clientX: 4 }, 'to have rendered', h(
          'div',
          null,
          h(
            'span',
            { 'class': 'main-click' },
            'Main clicked 7'
          )
        ));
      });

      it('calls click on a sub component with `to contain`', function () {
        var component = renderIntoDocument(h(ClickableComponent, null));

        expect(component, 'with event', 'click', 'on', h('span', { 'class': 'item-click' }), 'to contain', h(
          'span',
          { 'class': 'item-click' },
          'Item clicked 2'
        ));
      });

      it('calls click on a sub component with `not to contain`', function () {
        var component = renderIntoDocument(h(ClickableComponent, null));

        expect(component, 'with event', 'click', 'on', h('span', { 'class': 'item-click' }), 'not to contain', h(
          'span',
          { 'class': 'item-click' },
          'Item clicked 1'
        ));
      });

      it('calls click on a sub component with `not to contain with all children`', function () {
        var component = renderIntoDocument(h(ClickableComponent, null));

        expect(component, 'with event', 'click', 'on', h('span', { 'class': 'item-click' }), 'not to contain with all children', h(
          'span',
          { 'class': 'item-click' },
          'Item clicked 1'
        ));
      });

      it('ignores extra classes by default in the `on` clause', function () {

        var component = renderIntoDocument(h(ClickableComponent, null));
        expect(component, 'with event', 'click', 'on', h('span', { 'class': 'item-click testfoo' }), 'to contain', h(
          'span',
          { 'class': 'item-click' },
          'Item clicked 2'
        ));
      });

      it('calls click on a sub component with `queried for`', function () {
        var component = renderIntoDocument(h(ClickableComponent, null));

        expect(component, 'with event', 'click', 'on', h('span', { 'class': 'item-click' }), 'queried for', h('span', { 'class': 'item-click' }), 'to have rendered', h(
          'span',
          { 'class': 'item-click' },
          'Item clicked 2'
        ));
      });

      it('calls events with event parameters', function () {
        var component = renderIntoDocument(h(ClickableComponent, null));

        expect(component, 'with event', 'mousedown', { clientX: 50 }, 'to have rendered', h(
          'div',
          null,
          h(
            'span',
            { 'class': 'main-click' },
            'Main clicked 51'
          )
        ));
      });

      it('fails with a helpful error message when the target cannot be found', function () {

        var component = renderIntoDocument(h(ClickableComponent, null));

        expect(function () {
          return expect(component, 'with event', 'click', 'on', h('span', { 'class': 'not exists' }), 'to have rendered', h(
            'div',
            null,
            h(
              'span',
              null,
              'This is never checked'
            )
          ));
        }, 'to throw', /Could not find the target for the event. The best match was/);
      });

      it('passes the resulting component as the resolution of the promise', function () {

        var component = renderIntoDocument(h(ClickableComponent, null));

        return expect(component, 'with event', 'click').then(function (result) {
          expect(result.state, 'to satisfy', { clickCount: 2 });
        });
      });

      it('passes the resulting component as the resolution of the promise with an event argument', function () {

        var component = renderIntoDocument(h(ClickableComponent, null));

        return expect(component, 'with event', 'mousedown', { clientX: 10 }).then(function (result) {
          expect(result.state, 'to satisfy', { clickCount: 11 });
        });
      });

      it('passes the resulting component as the resolution of the promise when using `on`', function () {

        var component = renderIntoDocument(h(ClickableComponent, null));

        return expect(component, 'with event', 'click', 'on', h('span', { 'class': 'item-click' })).then(function (result) {
          expect(result.state, 'to satisfy', { itemClickCount: 2 });
        });
      });

      it('passes the resulting component as the resolution of the promise when using event arguments and `on`', function () {

        var component = renderIntoDocument(h(ClickableComponent, null));

        return expect(component, 'with event', 'mousedown', { clientX: 10 }, 'on', h('span', { 'class': 'item-click' })).then(function (result) {
          expect(result.state, 'to satisfy', { itemClickCount: 11 });
        });
      });

      it('passes the resulting component as the resolution of the promise with multiple events', function () {

        var component = renderIntoDocument(h(ClickableComponent, null));

        return expect(component, 'with event', 'mousedown', { clientX: 10 }, 'on', h('span', { 'class': 'item-click' }), 'and with event', 'click').then(function (result) {
          expect(result.state, 'to satisfy', { clickCount: 12, itemClickCount: 11 });
        });
      });

      it('passes the resulting component as the resolution of the promise with multiple events and eventArgs', function () {

        var component = renderIntoDocument(h(ClickableComponent, null));

        return expect(component, 'with event', 'mousedown', { clientX: 10 }, 'on', h('span', { 'class': 'item-click' }), 'and with event', 'mousedown', { clientX: 15 }).then(function (result) {
          expect(result.state, 'to satisfy', { clickCount: 26, itemClickCount: 11 });
        });
      });

      it('uses the `eventTarget` prop to identify the target for the event', function () {

        var component = renderIntoDocument(h(ClickableComponent, null));

        return expect(component, 'with event', 'mousedown', { clientX: 10 }, 'on', h(
          'div',
          null,
          h('span', { 'class': 'item-click',
            eventTarget: true })
        )).then(function (result) {
          expect(result.state, 'to satisfy', { clickCount: 11, itemClickCount: 11 });
        });
      });

      describe('combined with queried for', function () {
        var TodoItem = function (_Component5) {
          _inherits(TodoItem, _Component5);

          function TodoItem() {
            _classCallCheck(this, TodoItem);

            var _this5 = _possibleConstructorReturn(this, (TodoItem.__proto__ || Object.getPrototypeOf(TodoItem)).call(this));

            _this5.state = {
              isCompleted: 'false'
            };
            _this5.onClick = _this5.onClick.bind(_this5);
            return _this5;
          }

          _createClass(TodoItem, [{
            key: 'onClick',
            value: function onClick() {
              this.setState({
                isCompleted: 'true'
              });
            }
          }, {
            key: 'render',
            value: function render() {
              return h(
                'div',
                null,
                h(
                  'span',
                  null,
                  this.props.label
                ),
                h(
                  'span',
                  null,
                  'Is complete ',
                  this.state.isCompleted
                ),
                h(
                  'button',
                  { onClick: this.onClick },
                  'Click me'
                )
              );
            }
          }]);

          return TodoItem;
        }(Component);

        var TodoList = function (_Component6) {
          _inherits(TodoList, _Component6);

          function TodoList() {
            _classCallCheck(this, TodoList);

            return _possibleConstructorReturn(this, (TodoList.__proto__ || Object.getPrototypeOf(TodoList)).apply(this, arguments));
          }

          _createClass(TodoList, [{
            key: 'render',
            value: function render() {
              return h(
                'div',
                null,
                h(TodoItem, { id: 1, label: 'one' }),
                h(TodoItem, { id: 2, label: 'two' }),
                h(TodoItem, { id: 3, label: 'three' })
              );
            }
          }]);

          return TodoList;
        }(Component);

        it('combines with queried for', function () {

          var component = renderIntoDocument(h(TodoList, null));
          expect(component, 'queried for', h(TodoItem, { id: 2 }), 'with event', 'click', 'on', h('button', null), 'to have rendered', h(
            'div',
            null,
            h(
              'span',
              null,
              'two'
            ),
            h(
              'span',
              null,
              'Is complete true'
            )
          ));
        });

        it('combines with queried for using the result promise', function () {

          var component = renderIntoDocument(h(TodoList, null));
          return expect(component, 'queried for', h(TodoItem, { id: 2 })).then(function (todoItem) {
            return expect(todoItem.base, 'with event', 'click', 'on', h('button', null), 'to have rendered', h(
              'div',
              null,
              h(
                'span',
                null,
                'two'
              ),
              h(
                'span',
                null,
                'Is complete true'
              )
            ));
          });
        });

        it('combines with queried for using the result promise and the event promise', function () {

          var component = renderIntoDocument(h(TodoList, null));
          return expect(component, 'queried for', h(TodoItem, { id: 2 })).then(function (todoItem) {
            return expect(todoItem.base, 'with event', 'click', 'on', h('button', null));
          }).then(function (todoItem) {
            return expect(todoItem, 'to have rendered', h(
              'div',
              null,
              h(
                'span',
                null,
                'two'
              ),
              h(
                'span',
                null,
                'Is complete true'
              )
            ));
          });
        });

        it('with event followed by queried for returns correct element', function () {

          var component = renderIntoDocument(h(TodoList, null));
          return expect(component, 'with event click', 'on', h(
            TodoItem,
            { id: 2 },
            h(
              'div',
              null,
              h('button', { eventTarget: true })
            )
          ), 'queried for', h(TodoItem, { id: 2 })).then(function (todoItem) {
            expect(todoItem.state, 'to satisfy', { isCompleted: 'true' });
          });
        });

        it('with multiple events followed by queried for returns correct element', function () {

          var component = renderIntoDocument(h(TodoList, null));
          return expect(component, 'with event', 'click', 'on', h(
            TodoItem,
            { id: 2 },
            h(
              'div',
              null,
              h('button', { eventTarget: true })
            )
          ), 'with event click', 'on', h(
            TodoItem,
            { id: 1 },
            h(
              'div',
              null,
              h('button', { eventTarget: true })
            )
          ), 'queried for', h(TodoItem, { id: 2 })).then(function (todoItem) {
            expect(todoItem.state, 'to satisfy', { isCompleted: 'true' });
          });
        });

        it('with multiple events followed by queried for for a HTML element returns correct element', function () {

          var component = renderIntoDocument(h(TodoList, null));
          return expect(component, 'with event', 'click', {}, 'with event', 'click', {}, 'with event', 'click', {}, 'queried for', h(
            TodoItem,
            { id: 2 },
            h('div', { queryTarget: true })
          )).then(function (div) {
            expect(div, 'to be a', window.HTMLElement);
            expect(div, 'to satisfy', { tagName: 'DIV' });
          });
        });
      });
    });

    describe('when deeply rendered', function () {

      var Stateless = function Stateless(props) {
        return h(
          'div',
          { 'class': 'stateless-ftw' },
          'Yay'
        );
      };

      it('renders a class component', function () {

        expect(h(CustomComp, { 'class': 'foo' }), 'when deeply rendered', 'to have rendered', h('div', { 'class': 'foo' }));
      });

      it('renders a stateless component', function () {

        expect(h(Stateless, null), 'when deeply rendered', 'to have exactly rendered', h(
          'div',
          { 'class': 'stateless-ftw' },
          'Yay'
        ));
      });

      it('errors when a stateless component render does not match', function () {

        expect(function () {
          return expect(h(Stateless, null), 'when deeply rendered', 'to have exactly rendered', h(
            'div',
            { 'class': 'stateless-broken' },
            'Yay'
          ));
        }, 'to throw', ['expected <Stateless />', 'when deeply rendered to have exactly rendered <div class="stateless-broken">Yay</div>', '', '<div class="stateless-ftw" // expected \'stateless-ftw\' to equal \'stateless-broken\'', '                           //', '                           // -stateless-ftw', '                           // +stateless-broken', '>', '  Yay', '</div>'].join('\n'));
      });
    });

    describe('to deeply render as', function () {

      var Stateless = function Stateless(props) {
        return h(
          'div',
          { 'class': 'stateless-ftw' },
          'Yay'
        );
      };

      it('renders a class component', function () {

        expect(h(CustomComp, { 'class': 'foo' }), 'to deeply render as', h('div', { 'class': 'foo' }));
      });

      it('renders a stateless component', function () {

        expect(h(Stateless, null), 'to deeply render as', h(
          'div',
          { 'class': 'stateless-ftw' },
          'Yay'
        ));
      });

      it('errors when a stateless component render does not match', function () {
        expect(function () {
          return expect(h(Stateless, null), 'to deeply render as', h(
            'div',
            { 'class': 'stateless-broken' },
            'Yay'
          ));
        }, 'to throw', ['expected <Stateless /> to deeply render as <div class="stateless-broken">Yay</div>', '', '<div class="stateless-ftw" // missing class \'stateless-broken\'', '>', '  Yay', '</div>'].join('\n'));
      });

      it('renders using the exactly flag', function () {
        expect(h(CustomComp, { 'class': 'foo' }), 'to exactly deeply render as', h('div', { 'class': 'foo' }));
      });

      it('outputs the error when using the exactly flag', function () {
        expect(function () {
          return expect(h(CustomComp, { 'class': 'foo' }), 'to exactly deeply render as', h('div', { 'class': 'foo bar' }));
        }, 'to throw', ['expected <CustomComp class="foo" />', 'to exactly deeply render as <div class="foo bar" />', '', '<div class="foo" // expected \'foo\' to equal \'foo bar\'', '                 //', '                 // -foo', '                 // +foo bar', '/>'].join('\n'));
      });

      it('outputs the error when using the with all classes flag', function () {
        expect(function () {
          return expect(h(CustomComp, { 'class': 'foo' }), 'to deeply render with all classes as', h('div', { 'class': 'foo bar' }));
        }, 'to throw', ['expected <CustomComp class="foo" />', 'to deeply render with all classes as <div class="foo bar" />', '', '<div class="foo" // missing class \'bar\'', '/>'].join('\n'));
      });
    });

    describe('snapshot assertions', function () {
      it('`to match snapshot` fails with an error message about using the right require', function () {
        expect(function () {
          return expect(h(CustomComp, null), 'when rendered', 'to match snapshot');
        }, 'to throw', /To use snapshot.*unexpected-preact\/jest/);
      });

      it('`to satisfy snapshot` fails with an error message about using the right require', function () {
        expect(function () {
          return expect(h(CustomComp, null), 'when rendered', 'to satisfy snapshot');
        }, 'to throw', /To use snapshot.*unexpected-preact\/jest/);
      });
    });
  });
}

runTests({ h: Preact.h, Component: Preact.Component, render: Preact.render }, 'preact');
runTests({ h: PreactCompat.createElement, Component: PreactCompat.Component, render: PreactCompat.render }, 'preact-compat');
//# sourceMappingURL=unexpected-preact-deep.spec.js.map