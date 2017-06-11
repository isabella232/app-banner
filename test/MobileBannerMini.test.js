import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';
import { describe, it } from 'mocha';

import MobileBannerMini from '../src/components/MobileBannerMini';

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
  const banner = mount(<MobileBannerMini app={app} locale={locale} onDismiss={handler} />);

  it('contains an icon and view btn', () => {
    expect(banner.find('img')).to.have.length.of(1);
    expect(banner.find('a')).to.have.length.of(1);
  });

  it('clicking on href will navigate browser', () => {
    expect(banner.find('a').prop('href')).to.eql(app.url);
  });

  it('contains app info', () => {
    expect(banner.find('a').find('img').prop('src')).to.eql(app.icon);
    expect(banner.text()).to.contain(app.name);
  });

  it('contains locale data', () => {
    expect(banner.text()).to.contain(locale.cta);
    expect(banner.find('a').text()).to.contain(locale.view);
  });
});
