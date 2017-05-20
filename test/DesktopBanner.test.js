import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import DesktopBanner from '../src/components/DesktopBanner';
import PhoneInput from '../src/components/PhoneInput';

const locale = {
  desktop_no_thanks: 'No thank you just hide that',
  desktop_send_link: 'Yup just send me a link',
  desktop_try: 'You can try it now',
  desktop_phone: 'Just enter your phone number and we\'ll send you a link',
};

const apple = {
  icon: 'apple.png',
  url: 'http://apple.com/my-app',
};

const google = {
  icon: 'google.png',
  url: 'https://google.com/my-app',
};

describe('DesktopBanner', () => {
  const onDismiss = spy();
  const onSend = spy();
  const banner = mount(
    <DesktopBanner
      onDismiss={onDismiss}
      onSend={onSend}
      locale={locale}
      google={google}
      apple={apple}
      country="SE"
    />
  );

  const bannerGoogle = mount(<DesktopBanner locale={locale} google={google} />);
  const bannerApple = mount(<DesktopBanner locale={locale} apple={apple} />);

  it('has phone input', () => {
    expect(banner.find(PhoneInput)).to.have.length.of(1);
  });

  it('has buttons', () => {
    expect(banner.find('button')).to.have.length.of(2);
  });

  it('has locale', () => {
    for(const name in locale) {
      expect(banner.text()).to.contain(locale[name]);
    }
  });

  it('has icon', () => {
    expect(bannerGoogle.find('img').find({ src: google.icon })).to.have.length.of(1);
    expect(bannerApple.find('img').find({ src: apple.icon })).to.have.length.of(1);
  });

  it('has default icon of one for apple app', () => {
    expect(banner.find('img').find({ src: apple.icon })).to.have.length.of(1);
  });

  it('has badges', () => {
    const b1 = banner.find('a').find({ href: apple.url });
    const b2 = banner.find('a').find({ href: google.url });
    expect(b1).to.have.length.of(1);
    expect(b2).to.have.length.of(1);

    expect(b1.find('img')).to.have.length.of(1);
    expect(b2.find('img')).to.have.length.of(1);
  });

  it('renders only required badges', () => {
    expect(bannerApple.find('a').find({ href: apple.url })).to.have.length.of(1);
    expect(bannerApple.find('a').find({ href: google.url })).to.have.length.of(0);

    expect(bannerGoogle.find('a').find({ href: apple.url })).to.have.length.of(0);
    expect(bannerGoogle.find('a').find({ href: google.url })).to.have.length.of(1);
  });

  // TODO: placement
  // TODO: loader
  // TODO: error
  // TODO: retry
  // TODO: success
  // TODO: hide after success
  // TODO: submit on enter

  it('will call onSend when hit enter in input', () => {
    onSend.reset();

    banner.find('input').simulate('keypress', {key: 'Enter'});

    expect(onSend.calledOnce).to.be.true;
  });

  it('will set default country for the input', () => {
    onSend.reset();

    banner.find('input').simulate('change', {target: {value: '123456789'}});
    banner.find('input').simulate('keypress', {key: 'Enter'});

    expect(onSend.calledWith('+46123456789')).to.be.true;
  });

  it('will call onSend when clicked on send button', () => {
    onSend.reset();

    const btn = banner.find('button').filterWhere(b => b.text().includes(locale.desktop_send_link));
    expect(btn).to.have.length.of(1);

    btn.simulate('click');
    expect(onSend.calledOnce).to.be.true;
  });

  it('will call onDismiss when clicked on dismiss button', () => {
    onDismiss.reset();

    const btn = banner.find('button').filterWhere(b => b.text().includes(locale.desktop_no_thanks));
    expect(btn).to.have.length.of(1);

    btn.simulate('click');
    expect(onDismiss.calledOnce).to.be.true;
  });

  it('wont render when dismissed', () => {
    expect(banner.find('img')).to.have.length.of(0);
  });
});