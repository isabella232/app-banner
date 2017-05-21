import React from 'react';
import ReactDom from 'react-dom';
import ElementClass from 'element-class';
import docCookies from 'doc-cookies';
import Base64 from 'min-base64';
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
    const data = Base64.btoa(JSON.stringify(se));
    docCookies.setItem(`${cookieName}.R`, data);
  }
}

function getQuery() {
  const scriptEl = document.querySelector('script#TheAppBanner');
  const scriptUrl = scriptEl.src;
  return QueryString.parse(scriptUrl.split('?')[1]);
}

function detectOs() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const winphone = /windows phone/i.test(userAgent);
  const android = /android/i.test(userAgent);
  const ios = (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream);
  const safari = /safari/i.test(userAgent);

  return {
    android,
    ios,
    winphone,
    desktop: !(android || ios || winphone),
    safari,
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
    .remove('AppBannerPresent');
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

function loadCountryCode() {
  const saved = window.sessionStorage.getItem(`${cookieName}.CountryCode`);
  if (saved) {
    return new Promise(done => done(saved));
  }

  return fetch('https://location.ombori.com/')
    .then(resp => resp.json())
    .resp((data) => {
      sessionStorage.setItem(`${cookieName}.CountryCode`, data.country);
      return data.country;
    });
}

function sendSMS(number, app) {
  const se = docCookies.getItem(`${cookieName}.R`);
  const session = (se) ? JSON.parse(Base64.atob(se)) : {};

  const data = {
    number,
    url: document.location.href,
    session,
    context: 'desktop',
    secure: true,
    apple: app.apple,
    google: app.google, // FIXME: maybe send only ids?
  };

  return fetch('https://sendapp.link/links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((resp) => {
    if (resp.status !== 200) {
      return new Promise().reject(`sendapp returned ${resp.status}`);
    }

    return true;
  });
}

function loadInfo(appleId, googleId) {
  const url = `https://sendapp.link/data?apple=${appleId}&google=${googleId}`;
  return fetch(url)
    .then(resp => resp.json());
}

// FIXME this should be the part of main fn
function onDismiss() {
  saveDismissed();
  hideMobileBanner();
}

function getComponent(app, os, query) {
  const lang = detectLang();
  const locale = getLocale(lang);

  if (!app) {
    return null;
  }

  if (os.desktop) {
    return loadCountryCode()
      .then(country => (
        <Desktop
          google={app.google}
          apple={app.apple}
          locale={locale}
          sender={number => sendSMS(number, app)}
          country={country}
          placement={query.placement}
          onDismiss={() => onDismiss()}
        />
      ));
  }

  if (os.ios) {
    locale.cta = locale.get_apple;
    return (
      <Mobile
        app={app.apple}
        locale={locale}
        onDismiss={() => onDismiss()}
      />
    );
  }

  if (os.android) {
    locale.cta = locale.get_google;
    return (
      <Mobile
        app={app.google}
        locale={locale}
        onDismiss={() => onDismiss()}
      />
    );
  }

  return null;
}

function main() {
  const query = getQuery();

  const os = detectOs();

  trackView();
  trackReferrer(); // Track the referrer and entry page so we can use that when generating links

  if (getDismissed()) {
    return; // already dismissed
  }

  // Do not show if on iOS and the native app baner is specified
  if (os.safari && os.ios && os.nativeAppBar) {
    return; // TODO: remove the native app banner
  }

  loadInfo(query.apple, query.google)
    .then(app => getComponent(app, os, query))
    .then((comp) => {
      if (comp) {
        render(comp);

        if (os.android || os.ios) {
          setTimeout(() => {
            showMobileBanner();
            fixHeader();
          }, 10);
        }
      }
    });
}

main();
