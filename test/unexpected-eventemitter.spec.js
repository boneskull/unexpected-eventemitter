/* eslint-env mocha */
'use strict';

const unexpected = require('unexpected');
const sinon = require('sinon');
const unexpectedEventEmitter = require('../src/unexpected-eventemitter');
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
    describe('when subject is a function', function () {
      describe('when EventEmitter does not emit an expected event', function () {
        it('should error', function () {
          expect(
            () => expect(() => {}, 'to emit from', ee, eventName),
            'to error with',
            new RegExp(
              `to emit from(?:[^]|.)EventEmitter(?:[^]|.)+${eventName}`
            )
          );
        });

        describe('and the subject throws', function () {
          it('should error with the thrown exception', function () {
            expect(
              () =>
                expect(
                  () => {
                    throw new Error('my exception');
                  },
                  'to emit from',
                  ee,
                  eventName
                ),
              'to error with',
              /my exception/
            );
          });
        });

        describe('and the subject is an async function', function () {
          it('should error', function () {
            return expect(
              () =>
                expect(() => Promise.resolve(), 'to emit from', ee, eventName),
              'to error with',
              new RegExp(
                `to emit from(?:[^]|.)EventEmitter(?:[^]|.)+${eventName}`
              )
            );
          });

          describe('and the subject rejects', function () {
            it('should error with the rejected Promise', function () {
              return expect(
                () =>
                  expect(
                    () => Promise.reject(new Error('my exception')),
                    'to emit from',
                    ee,
                    eventName
                  ),
                'to error with',
                /my exception/
              );
            });
          });
        });
      });

      describe('when EventEmitter emits an expected event', function () {
        it('should not error', function () {
          return expect(
            () =>
              expect(() => ee.emit(eventName), 'to emit from', ee, eventName),
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

          describe('and the subject rejects', function () {
            it('should error with the rejected Promise', function () {
              return expect(
                () =>
                  expect(
                    () =>
                      Promise.resolve().then(() => {
                        ee.emit(eventName);
                        throw new Error('my exception');
                      }),
                    'to emit from',
                    ee,
                    eventName
                  ),
                'to error with',
                /my exception/
              );
            });
          });
        });

        describe('and that event is "error"', function () {
          beforeEach(function () {
            eventName = 'error';
          });

          it('should not error', function () {
            expect(
              () =>
                expect(() => ee.emit(eventName), 'to emit from', ee, eventName),
              'not to error'
            );
          });
        });

        describe('and the subject throws', function () {
          beforeEach(function () {
            eventName = 'foo';
          });

          it('should error with the thrown exception', function () {
            expect(
              () =>
                expect(
                  () => {
                    ee.emit(eventName);
                    throw new Error('my exception');
                  },
                  'to emit from',
                  ee,
                  eventName
                ),
              'to error with',
              /my exception/
            );
          });
        });
      });
    });

    describe('when subject is a Promise', function () {
      describe('when EventEmitter does not emit an expected event', function () {
        it('should error', function () {
          return expect(
            () => expect(Promise.resolve(), 'to emit from', ee, eventName),
            'to error with',
            new RegExp(
              `to emit from(?:[^]|.)EventEmitter(?:[^]|.)+${eventName}`
            )
          );
        });

        describe('and the subject rejects', function () {
          it('should error with the rejection', function () {
            return expect(
              () =>
                expect(
                  Promise.reject(new Error('my exception')),
                  'to emit from',
                  ee,
                  eventName
                ),
              'to error with',
              /my exception/
            );
          });
        });
      });

      describe('when EventEmitter emits an expected event', function () {
        it('should not error', function () {
          return expect(
            () =>
              expect(
                Promise.resolve().then(() => ee.emit(eventName)),
                'to emit from',
                ee,
                eventName
              ),
            'not to error'
          );
        });

        describe('and that event is "error"', function () {
          beforeEach(function () {
            eventName = 'error';
          });

          it('should not error', function () {
            return expect(
              () =>
                expect(
                  Promise.resolve().then(() => ee.emit(eventName)),
                  'to emit from',
                  ee,
                  eventName
                ),
              'not to error'
            );
          });
        });

        describe('and the subject rejects', function () {
          beforeEach(function () {
            eventName = 'foo';
          });

          it('should error with the rejection', function () {
            return expect(
              () =>
                expect(
                  Promise.resolve().then(() => {
                    ee.emit(eventName);
                    throw new Error('my exception');
                  }),
                  'to emit from',
                  ee,
                  eventName
                ),
              'to error with',
              /my exception/
            );
          });
        });
      });
    });
  });

  describe('to emit from (with values)', function () {
    let value;

    beforeEach(function () {
      value = 'bar';
    });

    describe('when the subject is a function', function () {
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

    describe('when the subject is a Promise', function () {
      describe('when EventEmitter does not emit an expected event', function () {
        it('should reject', function () {
          return expect(
            () =>
              expect(Promise.resolve(), 'to emit from', ee, eventName, value),
            'to error with',
            new RegExp(
              `to emit from(?:[^]|.)EventEmitter(?:[^]|.)+?${eventName}(?:[^]|.)+${value}`
            )
          );
        });
      });

      describe('when EventEmitter emits an expected event', function () {
        describe('with an unexpected value', function () {
          it('should reject', function () {
            return expect(
              () =>
                expect(
                  Promise.resolve().then(() => ee.emit(eventName, 'baz')),
                  'to emit from',
                  ee,
                  eventName,
                  value
                ),
              'to error with',
              new RegExp(
                `to emit from(?:[^]|.)EventEmitter(?:[^]|.)+?${eventName}(?:[^]|.)+${value}`
              )
            );
          });
        });

        describe('with an expected value', function () {
          it('should not throw', function () {
            return expect(
              () =>
                expect(
                  Promise.resolve().then(() => ee.emit(eventName, value)),
                  'to emit from',
                  ee,
                  eventName,
                  value
                ),
              'to be fulfilled'
            );
          });

          describe('satisfying a condition', function () {
            it('should not throw', function () {
              return expect(
                () =>
                  expect(
                    Promise.resolve().then(() => ee.emit(eventName, value)),
                    'to emit from',
                    ee,
                    eventName,
                    expect.it(() => value)
                  ),
                'to be fulfilled'
              );
            });
          });
        });

        describe('with unexpected values', function () {
          let values;
          beforeEach(function () {
            values = ['baz', 'quux'];
          });
          it('should reject', function () {
            return expect(
              () =>
                expect(
                  Promise.resolve().then(() =>
                    ee.emit(eventName, values[0], 'bar')
                  ),
                  'to emit from',
                  ee,
                  eventName,
                  ...values
                ),
              'to error with',
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

          it('should not reject', function () {
            return expect(
              () =>
                expect(
                  Promise.resolve().then(() =>
                    ee.emit(eventName, ...values.concat('bar'))
                  ),
                  'to emit from',
                  ee,
                  eventName,
                  ...values
                ),
              'to be fulfilled'
            );
          });
        });
      });
    });
  });

  describe('not to emit from', function () {
    describe('when the subject is a function', function () {
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

    describe('when the subject is a Promise', function () {
      describe('when EventEmitter does not emit an expected event', function () {
        it('should not reject', function () {
          return expect(
            () => expect(Promise.resolve(), 'not to emit from', ee, 'foo'),
            'to be fulfilled'
          );
        });
      });

      describe('when EventEmitter emits an expected event', function () {
        it('should error', function () {
          return expect(
            () =>
              expect(
                Promise.resolve().then(() => ee.emit('foo')),
                'not to emit from',
                ee,
                'foo'
              ),
            'to error with',
            /not to emit from(?:[^]|.)EventEmitter(?:[^]|.)+foo/
          );
        });
      });
    });
  });

  describe('to emit with error from', function () {
    describe('when the subject is a function', function () {
      describe('when subject errors', function () {
        describe('when EventEmitter does not emit an expected event', function () {
          it('should error with "failed to emit" error', function () {
            let error = new Error('my exception');
            expect(
              () =>
                expect(
                  () => {
                    throw error;
                  },
                  'to emit with error from',
                  error,
                  ee,
                  eventName
                ),
              'to error with',
              new RegExp(
                `to emit with error from(?:[^]|.)+?${error.message}(?:[^]|.)+?EventEmitter(?:[^]|.)+${eventName}`
              )
            );
          });
        });

        describe('when EventEmitter emits an expected event', function () {
          it('should not error', function () {
            let error = new Error('my exception');
            expect(
              () =>
                expect(
                  () => {
                    ee.emit(eventName);
                    throw error;
                  },
                  'to emit with error from',
                  error,
                  ee,
                  eventName
                ),
              'not to error'
            );
          });
        });
      });

      describe('when subject does not error', function () {
        describe('and the subject does not emit the event', function () {
          it('should error because the subject did not error', function () {
            let error = new Error('my exception');
            expect(
              () =>
                expect(
                  () => {},
                  'to emit with error from',
                  error,
                  ee,
                  eventName
                ),
              'to error with',
              /my exception/
            );
          });
        });

        describe('and the subject emits the event', function () {
          it('should error because the subject did not error', function () {
            let error = new Error('my exception');
            expect(
              () =>
                expect(
                  () => {
                    ee.emit(eventName);
                  },
                  'to emit with error from',
                  error,
                  ee,
                  eventName
                ),
              'to error with',
              /my exception/
            );
          });
        });
      });
    });

    describe('when the subject is a Promise', function () {
      describe('when subject rejects', function () {
        describe('when EventEmitter does not emit an expected event', function () {
          it('should reject with "failed to emit" error', function () {
            let error = new Error('my exception');
            return expect(
              () =>
                expect(
                  Promise.resolve().then(() => {
                    throw error;
                  }),
                  'to emit with error from',
                  error,
                  ee,
                  eventName
                ),
              'to error with',
              new RegExp(
                `to emit with error from(?:[^]|.)+?${error.message}(?:[^]|.)+?EventEmitter(?:[^]|.)+${eventName}`
              )
            );
          });
        });

        describe('when EventEmitter emits an expected event', function () {
          it('should not error', function () {
            let error = new Error('my exception');
            expect(
              () =>
                expect(
                  () => {
                    ee.emit(eventName);
                    throw error;
                  },
                  'to emit with error from',
                  error,
                  ee,
                  eventName
                ),
              'not to error'
            );
          });
        });
      });

      describe('when subject does not error', function () {
        describe('and the subject does not emit the event', function () {
          it('should error because the subject did not error', function () {
            let error = new Error('my exception');
            expect(
              () =>
                expect(
                  () => {},
                  'to emit with error from',
                  error,
                  ee,
                  eventName
                ),
              'to error with',
              /my exception/
            );
          });
        });

        describe('and the subject emits the event', function () {
          it('should error because the subject did not error', function () {
            let error = new Error('my exception');
            expect(
              () =>
                expect(
                  () => {
                    ee.emit(eventName);
                  },
                  'to emit with error from',
                  error,
                  ee,
                  eventName
                ),
              'to error with',
              /my exception/
            );
          });
        });
      });
    });
  });
});
