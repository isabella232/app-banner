import React from 'react';
import ReactDom from 'react-dom';
import QueryString from 'query-string';

import AppBanner from './components/AppBanner';

function init(props) {
  const el = document.createElement('div');
  ReactDom.render(<AppBanner {...props} />, el);
  document.body.appendChild(el);
}

function getQuery() {
  const scriptEl = document.querySelector('script#TheAppBanner');
  if (!scriptEl) {
    return null;
  }

  const scriptUrl = scriptEl.src;
  return QueryString.parse(scriptUrl.split('?')[1]);
}

function main() {
  const q = getQuery();
  if (q) {
    // shorthands for script parameters
    q.placement = q.placement || q.p;
    q.minimizeOnDismiss = q.minimizeOnDismiss || q.m;
    q.apple = q.apple || q.a;
    q.google = q.google || q.g;

    init(q);
  }
}

main();

export default {
  init,
};
