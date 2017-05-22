require('babel-register');
require.extensions['.svg'] = () => null;

// FIXME: thats ugly and caused by babel inability to correctly load scss
require.extensions['.scss'] = (module) => {
  module.exports = {
    banner__dismiss: 'banner__dismiss',
    'banner__upside-down': 'banner__upside-down',
    banner__phone_input_error: 'banner__phone_input_error',
  };
};

const jsdom = require('jsdom').jsdom;

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};
