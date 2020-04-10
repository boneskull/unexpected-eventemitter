/* eslint-env mocha */
'use strict';

const unexpected = require('unexpected');
const sinon = require('sinon');
const unexpectedEventEmitter = require('..');
const {EventEmitter} = require('events');

describe('unexpected-eventemitter', function () {
  let expect;
  let sbx;
  let eventName;
  let ee;

  beforeEach(function () {
    expect = unexpected.clone().use(unexpectedEventEmitter);
    ee = new EventEmitter();
    sbx = sinon.createSandbox();
    eventName = 'foo';
  });

  afterEach(function () {
    expect(ee.listenerCount(eventName), 'to be', 0);
    sbx.restore();
  });

  describe('to emit from', function () {
    describe('when EventEmitter does not emit an expected event', function () {
      it('should error', function () {
        expect(
          () => expect(() => {}, 'to emit from', ee, eventName),
          'to error',
          new RegExp(`to emit from(?:[^]|.)EventEmitter(?:[^]|.)+${eventName}`)
        );
      });

      describe('and the subject is an async function', function () {
        it('should error', function () {
          return expect(
            () =>
              expect(() => Promise.resolve(), 'to emit from', ee, eventName),
            'to error'
          );
        });
      });
    });

    describe('when EventEmitter emits an expected event', function () {
      it('should not error', function () {
        return expect(
          () => expect(() => ee.emit(eventName), 'to emit from', ee, eventName),
          'not to error'
        );
      });

      describe('and the subject is an async function', function () {
        it('should not error', function () {
          return expect(
            () =>
              expect(
                () =>
                  Promise.resolve().then(() => {
                    ee.emit(eventName);
                  }),
                'to emit from',
                ee,
                eventName
              ),
            'not to error'
          );
        });
      });

      describe('and that event is "error"', function () {
        beforeEach(function () {
          eventName = 'error';
        });

        it('should not throw', function () {
          expect(
            () =>
              expect(() => ee.emit(eventName), 'to emit from', ee, eventName),
            'not to throw'
          );
        });
      });
    });
  });

  describe('to emit a value from', function () {
    let value;

    beforeEach(function () {
      value = 'bar';
    });

    describe('when EventEmitter does not emit an expected event', function () {
      it('should throw', function () {
        expect(
          () => expect(() => {}, 'to emit from', ee, eventName, value),
          'to throw',
          new RegExp(
            `to emit from(?:[^]|.)EventEmitter(?:[^]|.)+?${eventName}(?:[^]|.)+${value}`
          )
        );
      });
    });

    describe('when EventEmitter emits an expected event', function () {
      describe('with an unexpected value', function () {
        it('should throw', function () {
          expect(
            () =>
              expect(
                () => ee.emit(eventName, 'baz'),
                'to emit from',
                ee,
                eventName,
                value
              ),
            'to throw',
            new RegExp(
              `to emit from(?:[^]|.)EventEmitter(?:[^]|.)+?${eventName}(?:[^]|.)+${value}`
            )
          );
        });
      });

      describe('with an expected value', function () {
        it('should not throw', function () {
          expect(
            () =>
              expect(
                () => ee.emit(eventName, value),
                'to emit from',
                ee,
                eventName,
                value
              ),
            'not to throw'
          );
        });

        describe('satisfying a condition', function () {
          it('should not throw', function () {
            expect(
              () =>
                expect(
                  () => ee.emit(eventName, value),
                  'to emit from',
                  ee,
                  eventName,
                  expect.it(() => value)
                ),
              'not to throw'
            );
          });
        });
      });

      describe('with unexpected values', function () {
        let values;
        beforeEach(function () {
          values = ['baz', 'quux'];
        });
        it('should throw', function () {
          expect(
            () =>
              expect(
                () => ee.emit(eventName, values[0], 'bar'),
                'to emit from',
                ee,
                eventName,
                ...values
              ),
            'to throw',
            new RegExp(
              `to emit from(?:[^]|.)EventEmitter(?:[^]|.)+?${eventName}(?:[^]|.)+?${values[0]}(?:[^]|.)+${values[1]}`
            )
          );
        });
      });

      describe('with more values than were expected', function () {
        let values;
        beforeEach(function () {
          values = ['baz', 'quux'];
        });

        it('should not throw', function () {
          expect(
            () =>
              expect(
                () => ee.emit(eventName, ...values.concat('bar')),
                'to emit from',
                ee,
                eventName,
                ...values
              ),
            'not to throw'
          );
        });
      });
    });
  });

  describe('not to emit from', function () {
    describe('when EventEmitter does not emit an expected event', function () {
      it('should not error', function () {
        expect(
          () => expect(() => {}, 'not to emit from', ee, 'foo'),
          'not to error'
        );
      });

      describe('and the subject is an async function', function () {
        it('should not error', function () {
          return expect(
            () =>
              expect(
                () => Promise.resolve(),
                'not to emit from',
                ee,
                eventName
              ),
            'not to error'
          );
        });
      });
    });

    describe('when EventEmitter emits an expected event', function () {
      it('should error', function () {
        expect(
          () => expect(() => ee.emit('foo'), 'not to emit from', ee, 'foo'),
          'to error',
          /not to emit from(?:[^]|.)EventEmitter(?:[^]|.)+foo/
        );
      });

      describe('and the subject is an async function', function () {
        it('should error', function () {
          return expect(
            () =>
              expect(
                () =>
                  Promise.resolve().then(() => {
                    ee.emit(eventName);
                  }),
                'not to emit from',
                ee,
                eventName
              ),
            'to error'
          );
        });
      });
    });
  });
});
