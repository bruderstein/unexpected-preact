It's possible to check for a part of the subtree, without
testing the entire returned tree.  This allows you to test specific elements, without
writing brittle tests that break when the structure changes.

Assuming the following component output
```js
class MyComponent extends Component {
  render () {
    return (
      <div>
        <span className="top">one</span>
        <span className="middle">two</span>
        <span className="bottom">three</span>
      </div>
    );
  }
};

```

```js
// This will pass, as `<span className="middle">two</span>` can be found in the component's output
expect(<MyComponent />, 
  'when rendered', 
  'to contain', <span>two</span>);
```

Notice that the extra `className="middle"` in the `<span className="middle">two</span>` is ignored,
in a similar way to the `to have rendered` assertion.

You can override this behaviour by using `'to contain exactly'`, and `'to contain with all children'`


```js
// This will fail, as `<span>two</span>` cannot be found in the renderers output, due to
// the missing `className="middle"` prop
expect(<MyComponent />, 
  'when rendered', 
  'to contain exactly', <span>two</span>);
```

```output
expected
<MyComponent>
  <div>
    <span className="top">one</span>
    <span className="middle">two</span>
    <span className="bottom">three</span>
  </div>
</MyComponent>
to contain exactly <span>two</span>

the best match was
<span class="middle" // class should be removed
>
  two
</span>
```

The same thing applies to children for `'to contain'` as for `'to have rendered'`.

