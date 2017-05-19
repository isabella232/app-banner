import { mount, shallow } from 'enzyme';
import chai, { expect } from 'chai';
import { spy } from 'sinon';

import React from 'react';

import PhoneInput from '../src/components/PhoneInput';

describe('PhoneInput', () => {
  it('contains an input field', () => {
    const input = mount(<PhoneInput />);

    expect(input.find('input')).to.have.length.of(1);
  })

  it('calls onChange when field is changed', () => {
    const handler = spy();
    const input = mount(<PhoneInput onChange={handler} />);

    input.find('input').simulate('change', {target: {value: '123'}});

    expect(handler.calledWith('123')).to.be.true;
  })

  // TODO: onkeypress
  // TODO: placeholder
  // TODO: error
  // TODO: disabled

  // TODO: auto change country code if user has entered something beginning with a + sign
  // TODO: allow plus sign (only in the beginning of the string)
  // TODO: cut leading zeroes when entering numbers

  it('removed everything except numbers and + at the beginning from input', () => {
    const handler = spy();
    const input = mount(<PhoneInput onChange={handler} />);

    input.find('input').simulate('change', {target: {value: '1ab2cd3'}});

    expect(handler.calledWith('123')).to.be.true;

    input.find('input').simulate('change', {target: {value: '+a_&%$3#***(7)5ba6yyy7'}});

    expect(handler.calledWith('37567')).to.be.true;
  })

  it('contains country selector', () => {
    const input = mount(<PhoneInput />);

    const select = input.find('select');

    expect(select).to.have.length.of(1);
    expect(select.find('option')).to.have.length.of.at.least(10);

    expect(input.html()).to.contain('Russia'); // make sure countries are loaded
  })

  it('calls onChange when the country code is changed', () => {
    const handler = spy();

    const input = mount(<PhoneInput onChange={handler} />);

    input.find('select').simulate('change', {target: {value: 'RU'}});
    input.find('input').simulate('change', {target: {value: '9206521234'}});

    expect(handler.calledWith('+79206521234')).to.be.true;

    input.find('select').simulate('change', {target: {value: 'US'}});

    expect(handler.calledWith('+19206521234')).to.be.true;
  })

  it('calls onEnter when enter is pressed', () => {
    const handler = spy();
    const input = mount(<PhoneInput country="RU" onEnter={handler} />);
    input.find('input').simulate('change', {target: {value: '12345678'}});

    handler.reset();
    input.find('input').simulate('keypress', {key: 'Enter'});

    expect(handler.calledOnce).to.be.true;
  })

  it('supports default country values', () => {
    const handler = spy();

    const input = mount(<PhoneInput country='RU' onChange={handler} />);

    input.find('input').simulate('change', {target: {value: '4852560000'}});

    expect(handler.calledWith('+74852560000')).to.be.true;
  })

  it('displays current country prefix and flag', () => {
    const input = mount(<PhoneInput country="RU" />);

    expect(input.text()).to.contain('+7');
    const icon = input.find('img');

    expect(icon).to.have.length.of(1);
    expect(icon.html()).to.contain('flags/RU.svg');
  })
})