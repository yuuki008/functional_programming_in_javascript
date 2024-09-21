import _ from 'lodash'

const Schduler = (function() {
  const delayedFn = _.bind(setTimeout, undefined, _, _)

  return {
    delay5: _.partial(delayedFn, _, 5000),
    delay10: _.partial(delayedFn, _, 10000),
    delay: _.partial(delayedFn, _, _)
  }
})();

Schduler.delay5(() => console.log('5 seconds later'))
Schduler.delay10(() => console.log('10 seconds later'))
Schduler.delay(() => console.log('1 second later'), 1)

