# unexpected-preact

The [preact.js](http://preactjs.com) version of [unexpected-react](http://bruderstein.github.io/unexpected-react)

## Installation

`npm install --save-dev unexpected unexpected-preact`

## Usage

ES6:
```js
import unexpected from 'unexpected';
import unexpectedPreact from 'unexpected-preact';

const expect = unexpected.clone().use(unexpectedPreact);
```

ES5
```js
var unexpected = require('unexpected');
var unexpectedPreact = require('unexpected-preact');

var expect = unexpected.clone().use(unexpectedPreact);
```

**For Jest, require/import `unexpected-preact/jest`**

Example test
```js
it('increases the count on click', function () {
  expect(<ClickCounter />,
    'when rendered',
    'with event', 'click', 'on', <button />,
    'to have rendered',
    <div>
      <span>Clicked 1 times</span>
      <button />
    </div>);
});
```


Full docs are being written, but for now see the [unexpected-react docs](http://bruderstein.github.io/unexpected-react/assertions/RenderedReactElement/)
as the assertions are all the same. Only deep (DOM) rendering is possible with preact, but you still get the full virtual tree as you see in the react-devtools, with all HTML elements and custom components. 
