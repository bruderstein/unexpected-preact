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

With jest, you can use the snapshot test functionality - see the [`'to match snapshot'`](https://bruderstein.github.io/unexpected-preact/assertions/RenderedPreactElement/to-match-snapshot/) assertion 

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


Read the [full documentation for the assertions](http://bruderstein.github.io/unexpected-preact/)

Only deep (DOM) rendering is possible with preact, but you still get the full virtual tree as you see in the react-devtools, with all HTML elements and custom components. 


### FAQ

Q: I get an error about SVGElement is not defined with Preact v6 and jest

A: Just define a global SVGElement function before you use Preact to render something

```js
if (!window.SVGElement) window.SVGElement = function () {};
```

### Status

Whilst this should be considered beta, it is based on unexpected-react and the supporting libraries, which have been used for 
production tests for well over a year in many large projects.  We've also got a very comprehensive test suite and integration
test suite, so if something were fundamentally broken we'd know quickly.

This library is maintained, and welcomes PRs and issues - please raise an issue if you have questions!

### License
MIT

