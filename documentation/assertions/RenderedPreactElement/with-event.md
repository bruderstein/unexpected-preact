## `with event` .... [`on`]

`with event` can trigger events on your components.  This is done by dispatching real browser events.

e.g. with a button that counts it's own clicks

```js

expect(<MyButton />, 
  'when rendered',
  'with event', 'click', 
  'to have rendered', <button>Button was clicked 1 times</button>);
```

If you want to trigger an event on a specific component, (i.e. not the top level component), use `on` 
after the event.

```js
const todoList = (
  <TodoList>
    <TodoItem id={1} label="Buy flowers for the wife"/>
    <TodoItem id={2} label="Mow the lawn"/>
    <TodoItem id={3} label="Buy groceries"/>
  </TodoList>
);

expect(
  todoList,
  'when rendered',
  'with event', 'click', 'on', <TodoItem id={3} />, 
  'to contain',
  <div className='completed'>
    <span className="label">Buy groceries</span>
  </div>
);
```

To pass arguments to the event, simply include the event object after the event name. As real browser events are used, arguments must be supported by the event type.

```js
expect(
  todoList,
  'when rendered',
  'with event mouseDown', { clientX: 150, clientY: 50 }, 'on', <TodoItem id={3} />,
  'to contain',
  <div className="completed">
    <span className="label">Buy groceries</span>
  </div>
);
```

This will call the function passed in the `onMouseDown` prop of the `<TodoItem>`.

## Multiple events

To call multiple events, simple list them one after the other:


```js
expect(
  todoList,
  'when rendered',
  'with event', 'click', { clientX: 150, clientY: 50 }, 'on', <TodoItem id={3} />,
  'with event', 'click', { clientX: 50, clientY: 50 }, 'on', <TodoItem id={2} />,
  'to have rendered', 
  <div className="items">
    <TodoItem id={2}>
      <div className="completed" />
    </TodoItem>
    <TodoItem id={3}>
      <div className="completed" />
    </TodoItem>
  </div>
);
```

You can optionally add `and` before the second and further events, to make it easier to read:

```js
expect(
  todoList,
  'when rendered',
  'with event', 'click', { clientX: 150, clientY: 50 }, 'on', <TodoItem id={3} />,
  'and with event', 'click', { clientX: 50, clientY: 50 }, 'on', <TodoItem id={2} />,
  'to have rendered', 
  <div className="items">
    <TodoItem id={2}>
      <div className="completed" />
    </TodoItem>
    <TodoItem id={3}>
      <div className="completed" />
    </TodoItem>
  </div>
);
```

You can extract the renderer after an event by using the result of the promise returned from `expect`

```js#async:true
return expect(
  todoList, 
  'when rendered',
  'with event', 'mouseDown', { clientX: 150, clientY: 50 }, 'on', <TodoItem id={3} />
).then(component => {
  expect(
    component,
    'to contain',
    <TodoItem id={3}>
      <div className='completed'/>
    </TodoItem>
  );
});
```

## eventTarget

You can add an `eventTarget` prop to the expected to trigger the event on a child component.
e.g. This will trigger the click in the `<button>` inside the `TodoItem` with the `id` of `2`

```js
expect(
  todoList, 
  'when rendered',
  'with event click', 'on', <TodoItem id={2}><span className="label" eventTarget /></TodoItem>,
  'to contain', 
  <TodoItem id={2}>
    <div className='completed'>
      <span>Completed!</span>
    </div>
  </TodoItem>
);
```

When no `eventTarget` is specified, the event is triggered on the top level element specified in the `on` clause.
