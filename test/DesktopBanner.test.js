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
  desktop_edit: 'Lemme edit this number',
  desktop_done: 'Okay we done here',
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
    const html = banner.html();

    const names = [
      'desktop_no_thanks',
      'desktop_send_link',
      'desktop_try',
      'desktop_phone',
      'desktop_phone_placeholder',
    ];

    names.forEach(name => expect(html).to.contain(locale[name]));
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

  // TODO: show error

  it('will place a placeholder msg into input when shown', () => {
    expect(banner.find('input').prop('placeholder')).to.eql(locale.desktop_phone_placeholder);
  });

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

  it('will call onDismiss when clicked on dismiss button', () => {
    const onDismiss = spy();
    const bnr = mount(<DesktopBanner onDismiss={onDismiss} {...defaults} />);

    const button = bnr.find('button').filterWhere(b => b.text().includes(locale.desktop_no_thanks));
    expect(button).to.have.length.of(1);

    button.simulate('click');
    expect(onDismiss.calledOnce).to.eql(true);
  });

  it('will disable controls when loading', () => {
    const bnr = mount(<DesktopBanner loading {...defaults} />);
    expect(bnr.find('input').prop('disabled')).to.be.eql(true);
  });

  it('will show the spinner when loading', () => {
    const bnr = mount(<DesktopBanner loading {...defaults} />);
    expect(bnr.find('input').prop('disabled')).to.be.eql(true);
  });

  it('will show retry buttons on success', () => {
    const onRetry = spy();
    const bnr = mount(<DesktopBanner success onRetry={onRetry} {...defaults} />);

    const button = bnr.find('button').filterWhere(b => b.text().includes(locale.desktop_edit));
    expect(button).to.have.length.of(1);

    button.simulate('click');
    expect(onRetry.calledOnce).to.eql(true);
  });

  it('will show done button on success', () => {
    const onDismiss = spy();
    const bnr = mount(<DesktopBanner success onDismiss={onDismiss} {...defaults} />);

    const button = bnr.find('button').filterWhere(b => b.text().includes(locale.desktop_done));
    expect(button).to.have.length.of(1);

    button.simulate('click');
    expect(onDismiss.calledOnce).to.be.eql(true);
  });

  it('supports placement property', () => {
    const bnr = mount(<DesktopBanner placement="upside-down" {...defaults} />);

    expect(bnr.html()).contains('upside-down');
  });

  it('supports error property', () => {
    const bnr = mount(<DesktopBanner error {...defaults} />);

    expect(bnr.html()).contains('error');
  });
});
