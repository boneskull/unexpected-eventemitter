# unexpected-eventemitter

> [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) assertions for [Unexpected](http://unexpected.js.org/)

## Installation

```shell
$ npm i unexpected unexpected-eventemitter --save-dev
```

- This package requires Node.js v14+ _or_ a browser supporting ES6.
- [unexpected](http://unexpected.js.org) v10+ is a _peer dependency_ of this package.
- In a browser, this module is exposed as `globalThis.unexpectedEventEmitter` or `window.unexpectedEventEmitter`.

## Example

```js
import unexpected from 'unexpected';
import unexpectedEventEmitter from 'unexpected-eventemitter';
import {EventEmitter} from 'node:events';

const expect = unexpected.clone().use(unexpectedEventEmitter);

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

// "to emit from" with Promise
expect(
  somethingAsync().then(() => {
    ee.emit('foo', {bar: 'baz'});
  }),
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

// "to emit with error from"
const err = new Error('uh oh');
expect(
  Promise.resolve().then(() => {
    ee.emit('foo', {bar: 'baz'});
    throw err;
  }),
  'to emit with error from',
  ee,
  'foo',
  err
); // ok
```

## Assertions

### `to emit from`

`<function|Promise> [not] to emit from <EventEmitter> <string> <any*>`

- `<function|Promise>` may be a Promise, async, or synchronous function
- `<EventEmitter>` may be a duck-typed Node.js [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)
- `<string>` is the event name
- `<any*>` corresponds to _zero (0) or more_ values which may be emitted. Do not use an array unless you expect the value to be an array!
- An `EventEmitter` emitting _more_ values than expected _will not_ fail an assertion.
- Values are checked with ["to satisfy"](http://unexpected.js.org/assertions/any/to-satisfy/) for flexibility.

### `to emit with error from`

`<function|Promise> to emit with error from <Error> <EventEmitter> <string> <any*>`

- Use when the subject `<function|Promise>` emits, but _also_ throws or rejects.
- A strict equality check is made against `Error`
- There is no converse of this assertion; you cannot use `[not]`.

## Contributing

Please use the [Conventional Commits](https://www.conventionalcommits.org) commit message format.

## Related Projects

- [unexpected-events](https://npm.im/unexpected-events): Provides an alternative syntax, with the ability to test multiple events at once

## License

:copyright: 2017 [Christopher Hiller](https://boneskull.com). Licensed Apache-2.0.
