---
template: default.ejs
theme: dark
title: unexpected-preact
repository: https://github.com/bruderstein/unexpected-preact
---

# unexpected-preact

Plugin for [unexpected](https://unexpected.js.org) to allow for testing against the full virtual DOM for [preact.js](http://preact.js)

# Features

* Assert Preact component's output using the full renderer and JSX "expected" values
* Trigger events on components
* Locate components using JSX queries
* Use snapshot tests in Jest, with smart diffing when something fails

# Examples

* Checking a simple render

```js

expect(
  <TodoList items={items} />,
  'to render as', 
  <TodoList>
    <div className='items'>
      <TodoItem id={1}>
        <span className="label">Buy flowers for the wife</span>
      </TodoItem>
      <TodoItem id={2}>
        <span className="label">Mow the lawn</span>
      </TodoItem>
      <TodoItem id={3}>
        <span className="label">Buy groceries</span>
      </TodoItem>
    </div>
  </TodoList>
);
```

* Triggering an event on a button inside a subcomponent (using the `eventTarget` prop to identify where the event should be triggered)

```js
expect(
  <TodoList items={items} />,
  'when rendered',
  'with event click',
  'on', <TodoItem id={2}><span className="label" eventTarget /></TodoItem>,
  'to contain',
  <TodoItem id={2}>
    <div className='completed'>
      <span>Completed!</span>
    </div>
  </TodoItem>
);
```


* Locating a component with `queried for` then validating the render

```js
expect(
  <TodoList items={items} />,
  'when rendered',
  'queried for', <TodoItem id={2} />,
  'to have rendered',
  <TodoItem id={2}>
    <div className='completed'/>
  </TodoItem>
);
```


* Locating a component and then checking the state of the component with the full renderer

```js#async:true
expect(
  <TodoList items={items} />,
  'when rendered',
  'with event click',
  'on', <TodoItem id={1}><span className="label" eventTarget /></TodoItem>,
  'queried for', <TodoItem id={1} />
).then(todoItem => {
  // Here we're checking the state, but we could perform
  // any operation on the instance of the component.
  expect(todoItem.state, 'to satisfy', { completed: true });
});
```

# Usage

```
npm install --save-dev unexpected unexpected-preact
```

## Initialising

### When using jest

`require` / `import` `'unexpected-preact/jest'` in order to use jest's snapshot testing

```js#evaluate:false

var unexpected = require('unexpected');
var unexpectedPreact = require('unexpected-preact/jest');

var MyComponent = require('../MyComponent);

const expect = unexpected.clone()
    .use(unexpectedPreact);
    
describe('MyComponent', function () {
    it('renders a button', function () {
        // All custom components and DOM elements are included in the tree,
        // so you can assert to whatever level you wish
        expect(<MyComponent />, 
          'to render as', 
          <MyComponent>
            <button>Click me</button>
          </MyComponent>);
    });
});
```

### When using mocha

Note: Unlike unexpected-react, the order of requires does not matter

```js#evaluate:false
require( '../testHelpers/emulateDom');

var unexpected = require('unexpected');
var unexpectedPreact = require('unexpected-preact');

var MyComponent = require('../MyComponent);

const expect = unexpected.clone()
    .use(unexpectedPreact);
    
describe('MyComponent', function () {
    it('renders a button', function () {
        // All custom components and DOM elements are included in the tree,
        // so you can assert to whatever level you wish
        expect(<MyComponent />, 
          'to render as', 
          <MyComponent>
            <button>Click me</button>
          </MyComponent>);
    });
});
```

## Emulating the DOM

### When using jest

For jest, this just works as jsdom is automatically configured.

### When using mocha

The `emulateDom` file depends on whether you want to use [`domino`](https://npmjs.com/package/domino), or [`jsdom`](https://npmjs.com/package/jsdom)

For `jsdom`:

```js#evaluate:false
// emulateDom.js - jsdom variant

if (typeof document === 'undefined') {

    const jsdom = require('jsdom').jsdom;
    global.document = jsdom('');
    global.window = global.document.defaultView;

    for (let key in global.window) {
        if (!global[key]) {
            global[key] = global.window[key];
        }
    }
    global.Node = global.window.Node;
    global.Text = global.window.Text;
}
```

For `domino`:

```js#evaluate:false
// emulateDom.js - domino variant

if (typeof document === 'undefined') {

    const domino = require('domino');
    global.window = domino.createWindow('');
    global.document = global.window.document;
    global.navigator = { userAgent: 'domino' };

    for (let key in global.window) {
        if (!global[key]) {
            global[key] = global.window[key];
        }
    }
}
```

# Preact Compatibility

unexpected-preact is tested with preact version 7 and 8, but has also been tested to work with version 6.

# Contributing

We welcome pull requests, bug reports, and extra test cases. If you find something that doesn't work
as you believe it should, or where the output isn't as good as it could be, raise an issue!

## Thanks

[Unexpected](http://unexpected.js.org) is a great library to work with, and I offer my sincere thanks to [@sunesimonsen](https://github.com/sunesimonsen)
and [@papandreou](https://github.com/papandreou), who have created an assertion library that makes testing JavaScript a joy.

Thanks to [@oskarhane](https://twitter.com/oskarhane) for initially asking about this and helping with some early feedback.

## License
MIT


