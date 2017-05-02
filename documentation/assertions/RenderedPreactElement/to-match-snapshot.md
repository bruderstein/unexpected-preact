Under [jest](https://facebook.github.io/jest/), you can use snapshots. Snapshot tests save a snapshot of the component as it is currently rendered to a `.snapshot` file under a directory `__snapshots__`. Note that the snapshots for `unexpected-preact` are saved to a different filename than those jest uses natively. This is because the format differs slightly.

Remember that to include snapshot support for the shallow and DOM renderers, you need to require unexpected-preact as `require('unexpected-preact/jest')`


```js
class MyComponent extends Component {
  render () {
    return (
      <div className="parent" id="main">
        <span>one</span>
        <span>two</span>
        <span>three</span>
      </div>
    );
  }
}
```


We can validate it matches the snapshot when it's rendered.  If no snapshot exists, it will be automatically created the first time it is run.

```js#evaluate:false
expect(<MyComponent />, 'when rendered', 'to match snapshot');
```

If in the future the component output changes, the error will be highlighted (using the same error highlighting used in the rest of unexpected-preact).

Once you have checked that the changes are correct, you can run `jest -u` to update the snapshot, or if running in watch mode, press `u`.

### Events
Triggered events still works, and can be combined with matching snaphots.

e.g.

```js#evaluate:false

expect(<MyComponent />, 
  'when rendered',
  'with event click', 
  'to match snapshot'
);
```

### Matching

The snapshot matches everything, so extra classes and attributes will causes a difference to be highlighted.  If you want your snapshots to work more like `to have rendered`, so new attributes, classes and child elements can be added without triggering a change, see the assertion `to satisfy snapshot`.

