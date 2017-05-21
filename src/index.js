import React from 'react';
import ReactDom from 'react-dom';
import MobileDetect from 'mobile-detect';
import ElementClass from 'element-class';
import docCookies from 'doc-cookies';
import { Base64 } from 'js-base64';
import QueryString from 'query-string';

import MobileBanner from './components/MobileBanner';
import DesktopBanner from './components/DesktopBanner';
import BannerWrapper from './components/BannerWrapper';

import fixHeader from './lib/fix-header';

import './main.scss';

import locales from './lib/locales';

const Mobile = BannerWrapper(MobileBanner);
const Desktop = BannerWrapper(DesktopBanner);

const cookieName = 'AppBanner';

// FIXME: hide if presencekit is running

// FIXME: value in country select list
// FIXME: error handling when sending the number

// TODO: add locales as json static files
// TODO: add all images (except flags?) in main bundle.js

// TODO: move from sass to cssinjs to avoid css class names conflicts
// TODO: release build with uglify-es and preact

// TODO: api to use as npm package

// TODO: make cookieName customizeable

function timer(timeout) {
  return new Promise(done => setTimeout(done, timeout));
}

function trackView() {
  const gaUrl = `https://sendapp.link/t/${document.location.href.replace(/http(s)?:\/\//, '')}`;

  const frame = document.createElement('iframe');
  frame.width = 1;
  frame.height = 1;
  frame.style.width = 1;
  frame.style.height = 1;
  frame.style.position = 'absolute';
  frame.style.top = '-100px';
  frame.style.left = '-100px';
  frame.src = gaUrl;

  document.body.appendChild(frame);
}

function trackReferrer() {
  const ref = docCookies.getItem(`${cookieName}.R`);

  if (typeof ref !== 'string') {
    const se = {
      ref: document.referrer,
      entry: document.location.href,
    };
    const data = Base64.encode(JSON.stringify(se));
    docCookies.setItem(`${cookieName}.R`, data);
  }
}

function getQuery() {
  const scriptEl = document.querySelector('script#TheAppBanner');
  const scriptUrl = scriptEl.src;
  return QueryString.parse(scriptUrl.split('?')[1]);
}

function detectOs() {
  const md = new MobileDetect(window.navigator.userAgent);
  const os = md.os();
  const android = os && os.match(/android/i);
  const ios = os && os.match(/ios/i);
  return {
    android,
    ios,
    desktop: !(android || ios),
    safari: /safari/i.test(window.navigator.userAgent),
    nativeAppBar: document.querySelector('meta[name="apple-itunes-app"]'),
  };
}

function detectLang() {
  return window.navigator.language.split('-').shift();
}

function getLocale(lang) {
  if (locales[lang]) {
    return Object.assign({}, locales.en, locales[lang]);
  }

  return locales.en;
}

function render(comp) {
  const el = document.createElement('div');
  ReactDom.render(comp, el);
  document.body.appendChild(el);
}

function showMobileBanner() {
  ElementClass(document.querySelector('html'))
    .add('AppBannerPresent');
}

function hideMobileBanner() {
  ElementClass(document.querySelector('html'))
    .remove('presenceDesktopBannerPresent');
}

function getDismissed() {
  if (docCookies.getItem(`${cookieName}.Dismissed`)) {
    return true;
  }

  if (window.localStorage.getItem(`${cookieName}.Dismissed`)) {
    return true;
  }

  return false;
}

function saveDismissed() {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  docCookies.setItem(`${cookieName}.Dismissed`, true, expires);

  window.localStorage.setItem(`${cookieName}.Dismissed`, expires.getTime());
}

async function loadCountryCode() {
  const saved = window.sessionStorage.getItem(`${cookieName}.CountryCode`);
  if (saved) {
    return saved;
  }

  const resp = await fetch('https://location.ombori.com/');
  const data = await resp.json();

  sessionStorage.setItem(`${cookieName}.CountryCode`, data.country);

  return data.country;
}

async function sendSMS(number, app) {
  const se = docCookies.getItem(`${cookieName}.R`);
  const session = (se) ? JSON.parse(Base64.decode(se)) : {};

  const data = {
    number,
    url: document.location.href,
    session,
    context: 'desktop',
    secure: true,
    apple: app.apple,
    google: app.google, // FIXME: maybe send only ids?
  };

  const resp = await fetch('https://sendapp.link/links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!resp.status === 200) {
    throw new Error(`sendapp returned ${resp.status}`);
  }
}

async function loadInfo(appleId, googleId) {
  const url = `https://sendapp.link/data?apple=${appleId}&google=${googleId}`;
  const resp = await fetch(url);
  return resp.json();
}

// FIXME this should be the part of main fn
function onDismiss() {
  saveDismissed();
  hideMobileBanner();
}

async function main() {
  const query = getQuery();

  const os = detectOs();
  const lang = detectLang();

  const locale = getLocale(lang);

  trackView();
  trackReferrer(); // Track the referrer and entry page so we can use that when generating links

  if (getDismissed()) {
    return; // already dismissed
  }

  // Do not show if on iOS and the native app baner is specified
  if (os.safari && os.ios && os.nativeAppBar) {
    return; // TODO: remove the native app banner
  }

  let app;
  try {
    app = await loadInfo(query.apple, query.google);
  } catch (e) {
    return;
  }

  if (!app) {
    return;
  }

  let comp;
  if (os.desktop) {
    const country = await loadCountryCode();
    comp = (
      <Desktop
        google={app.google}
        apple={app.apple}
        locale={locale}
        sender={number => sendSMS(number, app)}
        country={country}
        placement={query.placement}
        onDismiss={() => onDismiss()}
      />
    );
  }

  if (os.ios) {
    locale.cta = locale.get_apple;
    comp = (
      <Mobile
        app={app.apple}
        locale={locale}
        onDismiss={() => onDismiss()}
      />
    );
  }

  if (os.android) {
    locale.cta = locale.get_google;
    comp = (
      <Mobile
        app={app.apple}
        locale={locale}
        onDismiss={() => onDismiss()}
      />
    );
  }

  render(comp);

  if (os.android || os.ios) {
    await timer(10);
    showMobileBanner();
    fixHeader();
  }
}

main();
