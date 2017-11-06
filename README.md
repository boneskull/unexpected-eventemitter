# unexpected-eventemitter

> EventEmitter assertions for [Unexpected](http://unexpected.js.org/)

## Warning

**This module doesn't yet run in the browser**.

## Installation

```bash
$ npm i unexpected unexpected-eventemitter -D
```

## Example

```js
import unexpected from 'unexpected';
import uee from 'unexpected-eventemitter';
import {EventEmitter} from 'events';

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
