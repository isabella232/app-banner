import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';

import MobileBanner from '../src/components/MobileBanner';

const app = {
  icon: 'http://ya.ru/ya.png',
  name: 'My Super App',
  publisher: 'Shmublisher',
  url: 'http://google.com',
};

const locale = {
  cta: 'Not sure what is CTA', // FIXME
  view: 'Take a look at this gorgeous app',
};

describe('MobileBanner', () => {
  const handler = spy();
  const banner = mount(<MobileBanner app={app} locale={locale} onDismiss={handler} />);

  it('contains an icon and dismiss icon', () => {
    expect(banner.find('img')).to.have.length.of(2);
    expect(banner.find('a')).to.have.length.of(1);
  });

  it('clicking on href will navigate browser', () => {
    expect(banner.find('a').prop('href')).to.eql(app.url);
  });

  it('contains app info', () => {
    expect(banner.find('a').find('img').prop('src')).to.eql(app.icon);
    expect(banner.text()).to.contain(app.name);
    expect(banner.text()).to.contain(app.publisher);
  });

  it('contains locale data', () => {
    expect(banner.text()).to.contain(locale.cta);
    expect(banner.find('a').text()).to.contain(locale.view);
  });

  it('clicking dismiss will call ondismiss', () => {
    handler.reset();

    banner.find('img#dismiss').simulate('click'); // FIXME: need to remove this id
    expect(handler.calledOnce).to.be.true;
  });

  it('after dismiss banner wont render anymore', () => {
    expect(banner.find('img')).to.have.length.of(0);
  });
});
