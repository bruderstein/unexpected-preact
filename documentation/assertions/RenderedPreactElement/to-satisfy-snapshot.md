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


We can validate it satisfies the snapshot when it's rendered.  If no snapshot exists, it will be automatically created the first time it is run.      

```js#evaluate:false
expect(<MyComponent />, 'when rendered', 'to satisfy snapshot');
```

If in the future the component output changes, the error will be highlighted (using the same error highlighting used in the rest of unexpected-react).

Once you have checked that the changes are correct, you can run `jest -u` to update the snapshot, or if running in watch mode, press `u`.

### Events
Triggered events still works, and can be combined with matching snaphots.

e.g.

```js#evaluate:false

expect(<MyComponent />, 
  'when rendered',
  'with event click', 
  'to satisfy snapshot'
);
```

### Matching

The snapshot matches in the same way as `to have rendered`, so new classes, attributes and child nodes are not treated as a difference.  This can be advantageous when you want to add new features to a component, but expect the existing component to keep the same basic template. 

If you'd prefer to match the template exactly (order of classes is still ignored), see the assertion `to match snapshot`.
