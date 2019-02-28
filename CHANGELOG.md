
v2.0.4
* Update unexpected-htmllike-preactrendered-adapter to support elements created in `dangerouslySetInnerHTML`
* Fix bug with `'to contain <string>'` on pending-event type (thanks @salomvary for reporting)

v2.0.3
* No package changes, just add a missing repo link in package.json

v2.0.2
* Fix for `'queried for'` followed by `'with event'`
* Fix for triggering events with incorrectly cased event names - the case is now automatically corrected
* Integration tests added - now integration tested with preact 6, 7 and 8

v2.0.1
* Bump for new README and docs

v2.0.0
* (breaking) Make the returned promise from `expect` always return the component instance if a component was located (either via rendering or a sub-component via `'queried for'`). This keeps better compatibility with unexpected-react, and means there is no difference between preact and preact-compat rendered components.
* Fix remaining preact-compat issues
v1.0.2
* Fix some preact-compat incompatibilities

v1.0.1
* Initial version, basics working with standard preact
