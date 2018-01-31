'use strict';

const pkg = require('./package.json');

module.exports = {
  name: pkg.name,
  version: pkg.version,
  installInto(expect) {
    expect.addType({
      base: 'object',
      name: 'EventEmitter',
      identify(obj) {
        return (
          obj !== null &&
          typeof obj === 'object' &&
          typeof obj.emit === 'function' &&
          typeof obj.once === 'function' &&
          typeof obj.on === 'function'
        );
      }
    });

    expect.addAssertion(
      '<function> [not] to emit from <EventEmitter> <string> <any*>',
      (expect, subject, eventEmitter, eventName, ...values) => {
        let emitted = false;
        let emittedValues;

        function onEvent(...values) {
          emitted = true;
          emittedValues = values;
        }

        eventEmitter.once(eventName, onEvent);

        try {
          expect(subject, 'not to throw');
          expect(emitted, '[not] to be truthy');

          values.forEach((value, idx) => {
            expect(emittedValues[idx], '[not] to satisfy', value);
          });
        } finally {
          eventEmitter.removeListener(eventName, onEvent);
        }
      }
    );
  }
};
