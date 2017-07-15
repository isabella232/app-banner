import React, { Component } from 'react';
import docCookies from 'doc-cookies';
import Base64 from 'min-base64';
import PromisePF from 'promise-polyfill';

import MobileBanner from './MobileBanner';
import MobileAnimations from './MobileAnimations';

import DesktopBanner from './DesktopBanner';
import BannerWrapper from './BannerWrapper';

import locales from '../lib/locales';

import MobileTransition from './css/MobileTransition.scss';
import DesktopTransition from './css/DesktopTransition.scss';

const Mobile = BannerWrapper(MobileAnimations(MobileBanner));
const Desktop = BannerWrapper(DesktopBanner);

const cookieName = 'AppBanner';

// Emulating promise for old browsers
if (!window.Promise) {
  window.Promise = PromisePF;
}

// FIXME: hide if presencekit is running

// TODO: make cookieName customizeable
// TODO: test for npm pack
// TODO: test for React component via npm
// TODO: unit test for this component

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
    nativeAppBar: ios && safari && document.querySelector('meta[name="apple-itunes-app"]'),
  };
}

function detectLang() {
  return window.navigator.language.split('-').shift();
}

function getLocale(lang) {
  if (locales[lang]) {
    return { ...locales.en, ...locales[lang] };
  }

  return locales.en;
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
    .then((data) => {
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

function onDismiss() {
  saveDismissed();
}

export default class AppBanner extends Component {
  constructor(props) {
    super(props);

    this.os = null;
    this.locale = null;

    this.state = {
      app: null,
    };
  }

  componentWillMount() {
    const { noTrack } = this.props;

    const os = detectOs();
    this.os = os;

    const lang = detectLang();
    this.locale = getLocale(lang);

    if (noTrack === false) {
      trackView();
      trackReferrer();
    }

    this.minimized = getDismissed();
    this.minimize = this.getMinimize();

    // do not show if already dismissed and minimize is disabled
    if (this.minimized && !this.minimize) {
      return;
    }

    // do not show if already dismissed, on desktop and minimize only enabled for mobile
    if (this.minimized && os.desktop && this.minimize === 'mobile') {
      return;
    }

    // Do not show if on iOS and the native app baner is specified
    if (os.nativeAppBar) {
      return; // TODO: remove the native app banner
    }

    this.load();
  }

  // NOTE: props.minimize can have true/false (when used as React Component)
  //       'yes'/'no' and 'mobile' values - so we need to normalize it
  getMinimize() {
    const { minimize } = this.props;

    if (minimize === 'yes') {
      return true;
    }

    if (minimize === 'no') {
      return false;
    }

    return minimize;
  }

  load() {
    const { apple, google } = this.props;
    const { os } = this;

    loadInfo(apple, google)
      .then((app) => {
        if (os.desktop) {
          loadCountryCode()
            .then(country => this.setState({ country, app }));
        } else {
          this.setState({ app });
        }
      });
  }

  render() {
    const { app, country } = this.state;
    const { os, locale, minimized, minimize } = this;
    const { placement } = this.props;

    const minimizeOnDesktop = (minimize === true);
    const minimizeOnMobile = (minimize === true) || (minimize === 'mobile');

    if (!app) {
      return null;
    }

    // dirty fix for apple icons -- they are not https, this breaks https website security
    if (app.apple) {
      if (app.google) {
        app.apple.icon = app.google.icon; // use google icon, they're always https
      }
    }

    if (os.desktop) {
      return (
        <Desktop
          google={app.google}
          apple={app.apple}
          locale={locale}
          sender={number => sendSMS(number, app)}
          country={country}
          placement={placement}
          onDismiss={onDismiss}
          transition={DesktopTransition}
          minimize={minimizeOnDesktop}
          minimized={minimized}
        />
      );
    }

    if (os.ios) {
      locale.cta = locale.get_apple;
      return (
        <Mobile
          app={app.apple}
          locale={locale}
          onDismiss={onDismiss}
          transition={MobileTransition}
          minimize={minimizeOnMobile}
          minimized={minimized}
        />
      );
    }

    if (os.android) {
      locale.cta = locale.get_google;
      return (
        <Mobile
          app={app.google}
          locale={locale}
          onDismiss={onDismiss}
          transition={MobileTransition}
          minimize={minimizeOnMobile}
          minimized={minimized}
        />
      );
    }

    return null;
  }
}

AppBanner.defaultProps = {
  placement: 'bottom-right',
  minimize: 'no',
  noTrack: false,
};
