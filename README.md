# unexpected-eventemitter

> EventEmitter assertions for [Unexpected](http://unexpected.js.org/)

## Installation

**Requires Node.js v6 or newer**

```bash
$ npm i unexpected unexpected-eventemitter -D
```

## Example

```js
const unexpected = require('unexpected');
const uee = require('unexpected-eventemitter');
const {EventEmitter} = require('events');

const expect = unexpected.clone()
  .use(uee);

const ee = new EventEmitter();
expect(() => ee.emit('foo', {bar: 'baz'}), 'to emit from', ee, 'foo', {
  bar: 'baz'
});
```

## Assertions

### `to emit from`

`<function> [not] to emit from <EventEmitter> <string> <any*>`

- `EventEmitter` may be a duck-typed Node.js [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).
- `<any*>` corresponds to *zero (0) or more* values which may be emitted.
- An `EventEmitter` emitting *more* values than expected *will not* fail an assertion.
- Values are checked with ["to satisfy"](http://unexpected.js.org/assertions/any/to-satisfy/) for flexibility.

## License

:copyright: 2017 [Christopher Hiller](https://boneskull.com).  Licensed Apache-2.0.
