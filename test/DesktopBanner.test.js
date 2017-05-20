import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';
import { describe, it } from 'mocha';

import DesktopBanner from '../src/components/DesktopBanner';
import PhoneInput from '../src/components/PhoneInput';

const locale = {
  desktop_no_thanks: 'No thank you just hide that',
  desktop_send_link: 'Yup just send me a link',
  desktop_try: 'You can try it now',
  desktop_phone: 'Just enter your phone number and we\'ll send you a link',
  desktop_phone_placeholder: 'Enter something here',
};

const apple = {
  icon: 'apple.png',
  url: 'http://apple.com/my-app',
};

const google = {
  icon: 'google.png',
  url: 'https://google.com/my-app',
};

const defaults = {
  apple,
  google,
  locale,
};

describe('DesktopBanner', () => {
  const banner = mount(<DesktopBanner {...defaults} />);
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
      expect(banner.html()).to.contain(locale[name]);
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

  it('will place a placeholder msg into input when shown', () => {
    expect(banner.find('input').prop('placeholder')).to.eql(locale.desktop_phone_placeholder);
  });

  describe('when sending', () => {
    it('will call onSend when hit enter in input', () => {
      const onSend = spy();
      const bnr = mount(<DesktopBanner onSend={onSend} {...defaults} />);

      bnr.find('input').simulate('keypress', { key: 'Enter' });

      expect(onSend.calledOnce).to.eql(true);
    });

    it('will call onSend when clicked on send button', () => {
      const onSend = spy();
      const bnr = mount(<DesktopBanner onSend={onSend} {...defaults} />);

      const button = bnr.find('button').filterWhere(b => b.text().includes(locale.desktop_send_link));
      expect(button).to.have.length.of(1);

      button.simulate('click');
      expect(onSend.calledOnce).to.eql(true);
    });

    it('will set default country for the input', () => {
      const onSend = spy();
      const bnr = mount(<DesktopBanner onSend={onSend} {...defaults} country="SE" />);

      bnr.find('input').simulate('change', { target: { value: '123456789' } });
      bnr.find('input').simulate('keypress', { key: 'Enter' });

      expect(onSend.calledWith('+46123456789')).to.eql(true);
    });
  });

  describe('when dismissing', () => {
    const onDismiss = spy();
    const bnr = mount(<DesktopBanner onDismiss={onDismiss} {...defaults} />);

    it('will call onDismiss when clicked on dismiss button', () => {
      const button = bnr.find('button').filterWhere(b => b.text().includes(locale.desktop_no_thanks));
      expect(button).to.have.length.of(1);

      button.simulate('click');
      expect(onDismiss.calledOnce).to.eql(true);
    });

    it('wont render when dismissed', () => {
      expect(bnr.find('img')).to.have.length.of(0);
    });
  });

  describe('when loading', () => {
    const loader = spy();
    const bannerSend = mount(<DesktopBanner onSend={loader} {...defaults} />);

    it('will call onSend', () => {
      bannerSend.find('input').simulate('keypress', { key: 'Enter' });

      expect(loader.calledOnce).to.eql(true);
    });

    it('will disable the controls', () => {
      expect(bannerSend.find('input').prop('disabled')).to.be.eql(true);
    });

    it('will hide the buttons', () => {
      expect(bannerSend.find('button')).to.have.length.of(0);
    });
  });
});
