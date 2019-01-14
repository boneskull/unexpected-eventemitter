'use strict';

const {name, version} = require('./package.json');

module.exports = {
  name,
  version,
  installInto(expect) {
    expect.addType({
      base: 'object',
      name: 'EventEmitter',
      identify: obj =>
        obj !== null &&
        typeof obj === 'object' &&
        typeof obj.emit === 'function' &&
        typeof obj.once === 'function' &&
        typeof obj.on === 'function'
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

        try {
          expect(subject, 'not to throw');
          expect(emitted, '[not] to be truthy');

          values.forEach((value, idx) => {
            expect(emittedValues[idx], '[not] to satisfy', value);
          });
        } finally {
          ee.removeListener(eventName, onEvent);
        }
      }
    );
  }
};
