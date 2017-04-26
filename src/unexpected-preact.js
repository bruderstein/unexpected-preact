import types from './types/types';
import * as deepAssertions from './assertions/deepAssertions';


const Preact = require('preact');
Preact.options.debounceRendering = function (fn) { return fn(); };



module.exports = {
  name: 'unexpected-preact',

  installInto(expect) {

    expect.installPlugin(require('magicpen-prism'));

    types.installInto(expect);
    deepAssertions.installInto(expect);


    expect.addAssertion([
      '<RenderedPreactElement> to match snapshot',
      '<RenderedPreactElementPendingEvent> to match snapshot',
      '<RenderedPreactElement> to satisfy snapshot',
      '<RenderedPreactElementPendingEvent> to satisfy snapshot'
      ],
      function (expect) {
        expect.errorMode = 'bubble';
        expect.fail({
          message: function (output) {
            return output.error('To use snapshot assertions in jest, use \'unexpected-preact/jest\' to require or import unexpected-preact');
          },
          diff: function (output) {
            return output.error('To use snapshot assertions in jest, use \'unexpected-preact/jest\' to require or import unexpected-preact');
          }
        });
      }
    );
  },

};
