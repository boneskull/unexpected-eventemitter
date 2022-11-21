'use strict';

module.exports = {
  name: 'unexpected-eventemitter',
  version: '[VI]{{inject}}[/VI]',
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

    const toEmitFrom = (expect, subject, ee, eventName, ...values) => {
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
          return expect(subject, 'to be fulfilled');
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
    };

    const toEmitWithErrorFrom = (
      expect,
      subject,
      error,
      ee,
      eventName,
      ...values
    ) => {
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
          return expect(subject, 'to be rejected with', error);
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
    };

    expect
      .addAssertion(
        '<function> [not] to emit from <EventEmitter> <string> <any*>',
        toEmitFrom
      )
      .addAssertion(
        '<Promise> [not] to emit from <EventEmitter> <string> <any*>',
        toEmitFrom
      )
      .addAssertion(
        '<function> to emit with error from <Error> <EventEmitter> <string> <any*>',
        toEmitWithErrorFrom
      )
      .addAssertion(
        '<Promise> to emit with error from <Error> <EventEmitter> <string> <any*>',
        toEmitWithErrorFrom
      );
  },
};
