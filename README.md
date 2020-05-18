# unexpected-eventemitter

> [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) assertions for [Unexpected](http://unexpected.js.org/)

## Installation

```shell
$ npm i unexpected unexpected-eventemitter --save-dev
```

- This module requires Node.js v8+, IE11, or a modern browser.
- [unexpected](http://unexpected.js.org) is a _peer dependency_ of this module.
- In a browser, this module is exposed as `global.unexpectedEventEmitter`.

## Example

```js
const unexpected = require('unexpected');
const {EventEmitter} = require('events');

const expect = unexpected.clone().use(require('unexpected-eventemitter'));

const ee = new EventEmitter();

// "to emit from" with sync function
expect(
  () => {
    ee.emit('foo', {bar: 'baz'});
  },
  'to emit from',
  ee,
  'foo',
  {
    bar: 'baz',
  }
); // ok

// "to emit from" with async function
expect(
  async () => {
    await somethingAsync();
    ee.emit('foo', {bar: 'baz'});
  },
  'to emit from',
  ee,
  'foo',
  {
    bar: 'baz',
  }
); // ok

// "not to emit from" with async function
expect(
  async () => {
    await somethingAsync();
    ee.emit('foo', {bar: 'baz'});
  },
  'not to emit from',
  ee,
  'foo'
); // assertion failure!
```

## Assertions

### `to emit from`

`<function> [not] to emit from <EventEmitter> <string> <any*>`

- `<function>` may be a sync or `Promise`-returning function.
- `<EventEmitter>` may be a duck-typed Node.js [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)
- `<string>` is the event name
- `<any*>` corresponds to _zero (0) or more_ values which may be emitted. Do not use an array unless you expect the value to be an array!
- An `EventEmitter` emitting _more_ values than expected _will not_ fail an assertion.
- Values are checked with ["to satisfy"](http://unexpected.js.org/assertions/any/to-satisfy/) for flexibility.

### `to emit with error from`

`<function> to emit with error from <Error> <EventEmitter> <string> <any*>`

- Use when the subject `<function>` emits, but _also_ throws or rejects.
- There is no converse of this assertion; you cannot use `[not]`.

## Contributing

Please use the [Angular commit message format](https://www.npmjs.com/package/conventional-changelog-angular#commit-message-format).

## Related Projects

- [unexpected-events](https://npm.im/unexpected-events): Provides an alternative syntax, with the ability to test multiple events at once

## License

:copyright: 2017-2020 [Christopher Hiller](https://boneskull.com). Licensed Apache-2.0.
