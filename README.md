# unexpected-eventemitter

> [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) assertions for [Unexpected](http://unexpected.js.org/)

## Installation

```shell
$ npm i unexpected unexpected-eventemitter --save-dev
```

- This module requires Node.js v6+, IE11, or a modern browser.
- [unexpected](http://unexpected.js.org) is a _peer dependency_ of this module.

## Example

```js
const unexpected = require('unexpected');
const {EventEmitter} = require('events');

const expect = unexpected.clone().use(require('unexpected-eventemitter'));

const ee = new EventEmitter();
expect(() => ee.emit('foo', {bar: 'baz'}), 'to emit from', ee, 'foo', {
  bar: 'baz'
});
```

## Assertions

### `to emit from`

`<function> [not] to emit from <EventEmitter> <string> <any*>`

- `EventEmitter` may be a duck-typed Node.js [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).
- `<any*>` corresponds to _zero (0) or more_ values which may be emitted.
- An `EventEmitter` emitting _more_ values than expected _will not_ fail an assertion.
- Values are checked with ["to satisfy"](http://unexpected.js.org/assertions/any/to-satisfy/) for flexibility.

## Contributing

Please use the [Angular commit message format](https://www.npmjs.com/package/conventional-changelog-angular#commit-message-format).

## License

:copyright: 2017 [Christopher Hiller](https://boneskull.com). Licensed Apache-2.0.
