import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import DesktopBanner from '../src/components/DesktopBanner';
import PhoneInput from '../src/components/PhoneInput';

const locale = {
  desktop_no_thanks: 'No thank you just hide that',
  desktop_send_link: 'Yup just send me a link',
  desktop_try: 'You can try it now',
  desktop_phone: 'Just enter your phone number and we\'ll send you a link',
}

const apple = {
  icon: 'apple.png',
}

const google = {
  icon: 'google.png',
}

describe('DesktopBanner', () => {
  
  const onDismiss = spy();
  const onSend = spy();
  const banner = shallow(
    <DesktopBanner
      onDismiss={onDismiss} 
      onSend={onSend}
      locale={locale}
      google={google}
      apple={apple}
    />
  );
  
  it('has phone input', () => {
    expect(banner.find(PhoneInput)).to.have.length.of(1);
  })
  
  it('has buttons', () => {
    expect(banner.find('button')).to.have.length.at.least(2);
  })
  
  it('has locale', () => {
    for(const name in locale) { 
      expect(banner.text()).to.contain(locale[name]);
    }
  })
  
  it('has icon', () => {
    const bannerGoogle = shallow(<DesktopBanner locale={locale} google={google} />);
    expect(bannerGoogle.find('img').prop('src')).to.eql(google.icon);
    
    const bannerApple = shallow(<DesktopBanner locale={locale} apple={apple} />);
    expect(bannerApple.find('img').prop('src')).to.eql(apple.icon);
  })
  
  it('has default icon of one for apple app', () => {
    expect(banner.find('img').prop('src')).to.eql(apple.icon);
  })
  
  it('will call onSend when clicked on send button', () => {
    onSend.reset();
    
    banner.find('button#send').simulate('click');
    expect(onSend.calledOnce).to.be.true;
  });
  
  it('will call onDismiss when clicked on dismiss button', () => {
    onDismiss.reset();
    
    banner.find('button#dismiss').simulate('click');
    expect(onDismiss.calledOnce).to.be.true;
  })
  
  it('wont render when dismissed', () => {
    expect(banner.find('img')).to.have.length.of(0);
  })
});