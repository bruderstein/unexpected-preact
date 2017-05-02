
You can render a component with the shallow renderer directly with the `when rendered` assertion.

Say you have this component:
```js
const Pages = (props) => {
    const pageElements = [];
    for (let i = 1; i <= props.count; ++i) {
      pageElements.push(<a key={i} href={'/page-' + i}>Page {i}</a>);
    }
    return (
      <div>
        {pageElements}
      </div>
    );
};

```

You can check the rendering directly using the `when rendered` assertion, saving you from creating the container DOM node by hand:
```js
expect(<Pages count={3} />, 
    'when rendered',
    'to have rendered', 
    <div>
      <a href="/page-1">Page 1</a>
      <a href="/page-2">Page 2</a>
      <a href="/page-3">Page 3</a>
    </div>
);
```

You can optionally use `'when deeploy rendered'` which for Preact is identical, but maintains compatibility with unexpected-react. 
If you would like to be able to switch to React and keep the same tests, it is advisable to use `'when deeply rendered'`

Everything works after the `when rendered` as normal, so you can trigger events and use the other assertions as you would otherwise.
```js
expect(<MyButton />, 
    'when rendered', 
    'with event', 'click',
    'to have rendered', 
    <button>Button was clicked 1 times</button>
);
```
