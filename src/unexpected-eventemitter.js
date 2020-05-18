'use strict';

const {version} = require('../package.json');

module.exports = {
  name: 'unexpected-eventemitter',
  version,
  installInto(expect) {
    expect.addType({
      base: 'object',
      name: 'EventEmitter',
      identify: (obj) =>
        obj !== null &&
        typeof obj === 'object' &&
        typeof obj.emit === 'function' &&
        typeof obj.once === 'function' &&
        typeof obj.on === 'function',
    });

    expect
      .addAssertion(
        '<function> [not] to emit from <EventEmitter> <string> <any*>',
        (expect, subject, ee, eventName, ...values) => {
          let emitted = false;
          let emittedValues;
          // expect.errorMode = 'bubble';

          const onEvent = (...values) => {
            emitted = true;
            emittedValues = values;
          };

          ee.once(eventName, onEvent);

          return expect
            .promise(() => {
              expect.errorMode = 'bubble';
              return expect(subject, 'not to error');
            })
            .then(() => {
              expect.errorMode = 'default';
              expect(emitted, '[not] to be true');
              expect.errorMode = 'nested';
              values.forEach((value, idx) => {
                expect(emittedValues[idx], '[not] to satisfy', value);
              });
            })
            .finally(() => {
              ee.removeListener(eventName, onEvent);
            });
        }
      )
      .addAssertion(
        '<function> to emit with error from <Error> <EventEmitter> <string> <any*>',
        (expect, subject, error, ee, eventName, ...values) => {
          let emitted = false;
          let emittedValues;

          const onEvent = (...values) => {
            emitted = true;
            emittedValues = values;
          };

          ee.once(eventName, onEvent);

          return expect
            .promise(() => {
              expect.errorMode = 'bubble';
              return expect(subject, 'to error with', error);
            })
            .then(() => {
              expect.errorMode = 'default';
              expect(emitted, 'to be true');
              expect.errorMode = 'nested';
              values.forEach((value, idx) => {
                expect(emittedValues[idx], 'to satisfy', value);
              });
            })
            .finally(() => {
              ee.removeListener(eventName, onEvent);
            });
        }
      );
  },
};
