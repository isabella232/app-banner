import React from 'react';
import ReactDom from 'react-dom';
import MobileDetect from 'mobile-detect';
import ElementClass from 'element-class';

import MobileBanner from './components/MobileBanner';
import DesktopBanner from './components/DesktopBanner';
import BannerWrapper from './components/BannerWrapper';

import fixHeader from './lib/fix-header';

import './main.scss';

const Mobile = BannerWrapper(MobileBanner);
const Desktop = BannerWrapper(DesktopBanner);

const id = {
  apple: 'id1184932325',
  google: 'com.presencekit.eyerim',
};

const locale = {
  get_apple: 'GET - On the App Store',
  get_google: 'GET - On Google Play',

  view: 'View',
  get_app: 'get the app',
  sms_content: 'Thanks for downloading our app! Click this link to get it from Apple App store or Google Play: ',

  desktop_try: 'Try our new app',
  desktop_edit: 'Edit',
  desktop_done: 'Done',
  desktop_phone: 'Save some time? We can text you a download link!',
  desktop_phone_placeholder: 'Enter your phone number',
  desktop_no_thanks: 'No thanks',
  desktop_send_link: 'Send link',
};

async function loadInfo(appleId, googleId) {
  const url = `https://sendapp.link/data?apple=${appleId}&google=${googleId}`;
  const resp = await fetch(url);
  return resp.json();
}

// TODO: load locale
// TODO: load app data
// TODO: load location
// TODO: call to send link via sms

// FIXME: fix html style when mobile banner is closed
// FIXME: value in country select list
// FIXME: error handling when sending the number

// TODO: add locales as json static files
// TODO: add all images (except flags?) in main bundle.js

// TODO: move from sass to cssinjs to avoid css class names conflicts
// TODO: release build with uglify-es and preact

// TODO: api to use as npm package

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

function sender(value) {
  return new Promise(done => setTimeout(() => done(), 2000));
}

function render(comp) {
  const el = document.createElement('div');
  ReactDom.render(comp, el);
  document.body.appendChild(el);
}

async function showMobileBanner() {
  await new Promise(done => setTimeout(done, 10));

  ElementClass(document.querySelector('html'))
    .add('AppBannerPresent');
  fixHeader();
}

async function main() {
  const loc = locale;
  loc.cta = locale.get_apple;

  const os = detectOs();

  const app = await loadInfo(id.apple, id.google);

  let comp;
  if (os.desktop) {
    comp = (
      <Desktop
        google={app.google}
        apple={app.apple}
        locale={locale}
        sender={sender}
        country="RU"
      />
    );
  }

  if (os.ios) {
    locale.cta = locale.get_apple;
    comp = (
      <Mobile
        app={app.apple}
        locale={loc}
      />
    );
  }

  if (os.android) {
    locale.cta = locale.get_google;
    comp = (
      <Mobile
        app={app.apple}
        locale={loc}
      />
    );
  }

  render(comp);

  if (os.android || os.ios) {
    showMobileBanner();
  }
}

main();
