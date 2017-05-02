Given the following test component:

```js
const MyComponent = () => (
  <div className="parent" id="main">
    <span>one</span>
    <span>two</span>
    <span>three</span>
  </div>
)
```

You can validate the rendering of this component with the `to render as` assertion,
which renders the component to a new DOM node, and validates the output.

You can optionally use `'to deeply render as'`, which for Preact is identical, but does mean that the assertions will be compatible with unexpected-react.
If you want the ability to switch to React and keep the same tests, it is advisable to use `'to deeply render as'`.

```js
expect(<MyComponent />, 'to render as', <div className="parent" />);
```

This works using the same rules as `to have rendered`, but saves you creating a
new DOM node when you just want to validate some translation of props to
output.

```js
// The span "two" is missing here, but it is ignored.
expect(<MyComponent />, 'to render as',
  <div id="main">
    <span>one</span>
    <span>three</span>
  </div>
);
```

```js
// The following assertion will fail, as 'four' does not exist
expect(<MyComponent />, 'to render as',
  <div id="main">
    <span>one</span>
    <span>four</span>
  </div>
);
```

```output
expected <MyComponent />
to render as <div id="main"><span>one</span><span>four</span></div>

<div className="parent" id="main">
  <span>one</span>
  <span>
    two // -two
        // +four
  </span>
  <span>three</span>
</div>
```

If you want to check for an exact render, use `'to exactly render as'`.

Alternatively, if you don't care about extra props, but want to check that there are no extra child nodes, use `'to have rendered with all children'`
Note that `exactly` implies `with all children`, so you using both options is not necessary.

Normally wrappers (elements that simply wrap other components) are ignored. This can be useful if you have higher order
components wrapping your components, you can simply ignore them in your tests (they will be shown greyed out 
if there is a "real" error).  If you want to test that there are no extra wrappers, simply add 
`with all wrappers` to the assertion.


```js
// The span "two" is missing here, as is `className="parent"`
// The missing span will cause an assertion error, but the extra prop will be ignored
// due to `to have rendered with all children` being used

expect(<MyComponent />, 'to render with all children as',
  <div id="main">
    <span>one</span>
    <span>three</span>
  </div>
);
```

```output
expected <MyComponent />
to render with all children as <div id="main"><span>one</span><span>three</span></div>

<div className="parent" id="main">
  <span>one</span>
  <span>two</span> // should be removed
  <span>three</span>
</div>
```

```js
// The span "two" is missing here, as is `className="parent"`
// This will cause an assertion error,
// due to `to have exactly rendered` being used

expect(<MyComponent />, 'to exactly render as',
  <div id="main">
    <span>one</span>
    <span>three</span>
  </div>
);
```

```output
expected <MyComponent />
to exactly render as <div id="main"><span>one</span><span>three</span></div>

<div className="parent" // className should be removed
   id="main">
  <span>one</span>
  <span>two</span> // should be removed
  <span>three</span>
</div>
```

If you want to trigger events, use the `when rendered` assertion to render
the component, then use the other `with event` and `to have rendered` or `to contain`
assertions to validate the output.
