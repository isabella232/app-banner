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
  const text = {};
  // parse text[country-code] params
  Object.keys(q).forEach((key) => {
    const re = /^t(ext)?\[(..)\]$/.exec(key);

    if (re) {
      const id = re[2];
      text[id] = q[key];
    }
  });

  if (q) {
    // shorthands for script parameters
    q.placement = q.placement || q.p;
    q.minimize = q.minimize || q.m;
    q.apple = q.apple || q.a;
    q.google = q.google || q.g;
    q.noTrack = q.noTrack || q.n;
    q.text = text;

    init(q);
  }
}

main();

export default {
  init,
};
