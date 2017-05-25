// This is an entry point for using app-banner as npm package
// this will use the prebuilt version of app-banner.
//
// If you want to use app-banner as a React component, please use 'app-banner/src' npm package
//
// Usage:
//
// var AppBanner = require('app-banner');
// - or -
// import AppBanner from 'app-banner';
//
// AppBanner.init({
//   google: 'com.presencekit.eyerim',
//   apple: 'id1184932325',
//   position: 'bottom-left',
// });

function init(cfg) {
  var banner = require('./dist/main.js');
  return banner.init(cfg);
}

module.exports = {
  init: init,
};
