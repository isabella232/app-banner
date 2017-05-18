import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import MobileBanner from '../src/components/MobileBanner';

describe('MobileBanner', () => {
  it('can be rendered', () => {
    const banner = mount(<MobileBanner />);
    
    expect(banner.text()).to.contain('Hello world');
  });
  
  it('contains an icon and dismiss icon', () => {
    const banner = shallow(<MobileBanner />);
    expect(banner.find('img')).to.have.length.of(2);
    expect(banner.find('a')).to.have.length.of(1);
  });
})