v2.0.1
* Bump for new README and docs

v2.0.0
* (breaking) Make the returned promise from `expect` always return the component instance if a component was located (either via rendering or a sub-component via `'queried for'`). This keeps better compatibility with unexpected-react, and means there is no difference between preact and preact-compat rendered components.
* Fix remaining preact-compat issues
v1.0.2
* Fix some preact-compat incompatibilities

v1.0.1
* Initial version, basics working with standard preact
