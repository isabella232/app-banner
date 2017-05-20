import React from 'react';
import ReactDom from 'react-dom';

import MobileBanner from './components/MobileBanner';
import DesktopBanner from './components/DesktopBanner';
import BannerWrapper from './components/BannerWrapper';

const Mobile = BannerWrapper(MobileBanner);
const Desktop = BannerWrapper(DesktopBanner);

const app = {
  apple: {
    appId: 'id1184932325',
    icon: 'http://is5.mzstatic.com/image/thumb/Purple117/v4/de/70/d9/de70d9c8-7f4a-e498-fcc2-e6ac4b3b0202/source/350x350bb.jpg',
    name: 'eyerim',
    publisher: 'EYERIM, s.r.o.',
    url: 'https://geo.itunes.apple.com/app/id1184932325?at=1010l4',
  },
  google: {
    appId: 'com.presencekit.eyerim',
    icon: '//lh3.googleusercontent.com/67bRd3ERvJVW4SiK0H6UOJZn4XivKmKkuDMgkaqmCUPmOpaSXJVof2fC8wSEh88AlJ2P=w300',
    name: 'eyerim',
    publisher: 'eyerim',
    url: 'http://play.google.com/store/apps/details?id=com.presencekit.eyerim',
  },
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

function sender(value) {
  console.log(value);

  return new Promise(done => setTimeout(() => done(), 2000));
}

function render(el) {
  const loc = locale;
  loc.cta = locale.get_apple;

  // ReactDom.render(
  //   <Mobile
  //     app={app.apple}
  //     locale={loc}
  //   />, el);

  ReactDom.render(
    <Desktop
      google={app.google}
      apple={app.apple}
      locale={locale}
      sender={sender}
      country="RU"
    />, el);
}

function main() {
  render(document.querySelector('#root'));
}

main();

// TODO: release build with uglify-es and preact
