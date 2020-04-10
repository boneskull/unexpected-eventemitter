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

    expect.addAssertion(
      '<function> [not] to emit from <EventEmitter> <string> <any*>',
      (expect, subject, ee, eventName, ...values) => {
        let emitted = false;
        let emittedValues;

        const onEvent = (...values) => {
          emitted = true;
          emittedValues = values;
        };

        ee.once(eventName, onEvent);

        return expect
          .promise(() => expect(subject, 'not to error'))
          .then(() => {
            expect(emitted, '[not] to be true');
            values.forEach((value, idx) => {
              expect(emittedValues[idx], '[not] to satisfy', value);
            });
          })
          .finally(() => {
            ee.removeListener(eventName, onEvent);
          });
      }
    );
  },
};
