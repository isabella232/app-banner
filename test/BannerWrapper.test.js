import React from 'react';

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { spy } from 'sinon';

import BannerWrapper from '../src/components/BannerWrapper';

const MyComponent = props => (
  <div>
    Hello there
    <button id="dismiss" onClick={props.onDismiss} />
    <button id="send" onClick={props.onSend} />
    <button id="retry" onClick={props.onRetry} />
  </div>
);

const Wrapped = BannerWrapper(MyComponent);

describe('Desktop banner', () => {
  it('is rendered', () => {
    const banner = mount(<Wrapped />);
    expect(banner.text()).contains('Hello there');
  });

  it('renders wrapped component', () => {
    const banner = shallow(<Wrapped />);

    expect(banner.find(MyComponent)).to.have.length.of(1);
  });

  it('send all properties to wrapped component', () => {
    const banner = shallow(<Wrapped test="kekeke" />);

    expect(banner.find(MyComponent).prop('test')).to.eql('kekeke');
  });

  describe('when dismissed', () => {
    const onDismiss = spy();
    const banner = mount(<Wrapped onDismiss={onDismiss} />);

    it('calls onDismiss', () => {
      banner.find('#dismiss').simulate('click');
      expect(onDismiss.calledOnce).to.eql(true);
    });

    it('doesnt render anymore', () => {
      expect(banner.html()).to.eql(null);
    });
  });

  describe('when sending', () => {
    const sender = spy();
    const banner = shallow(<Wrapped sender={sender} />);

    it('calls sender', () => {
      banner.find(MyComponent).prop('onSend')('sometext');

      expect(sender.calledWith('sometext')).to.eql(true);
    });

    it('shows spinners', () => {
      expect(banner.find(MyComponent).prop('loading')).to.eql(true);
    });
  });

  it('shows error on failure', (next) => {
    const promise = new Promise((done, fail) => fail(false));
    const banner = shallow(<Wrapped sender={() => promise} />);

    banner.find(MyComponent).prop('onSend')('sometext');

    setTimeout(() => {
      expect(banner.find(MyComponent).prop('error')).to.eql(true);
      expect(banner.find(MyComponent).prop('loading')).to.eql(false);
      expect(banner.find(MyComponent).prop('success')).to.eql(false);
      next();
    }, 100);
  });

  it('shows success on success', (next) => {
    const promise = new Promise(done => done());
    const banner = shallow(<Wrapped sender={() => promise} />);

    banner.find(MyComponent).prop('onSend')('sometext');

    setTimeout(() => {
      expect(banner.find(MyComponent).prop('error')).to.eql(false);
      expect(banner.find(MyComponent).prop('loading')).to.eql(false);
      expect(banner.find(MyComponent).prop('success')).to.eql(true);
      next();
    }, 100);
  });

  it('calls dismiss after timeout', (next) => {
    const onDismiss = spy();
    const promise = new Promise(done => done());
    const banner = shallow(<Wrapped sender={() => promise} onDismiss={onDismiss} timeout={200} />);

    banner.find(MyComponent).prop('onSend')('sometext');

    setTimeout(() => {
      expect(onDismiss.calledOnce).to.eql(false);
    }, 100);

    setTimeout(() => {
      expect(onDismiss.calledOnce).to.eql(true);
      next();
    }, 300);
  });

  it('resets state when clicking retry', (next) => {
    const promise = new Promise(done => done());
    const banner = shallow(<Wrapped sender={() => promise} />);

    banner.find(MyComponent).prop('onSend')('sometext');

    setTimeout(() => {
      banner.find(MyComponent).prop('onRetry')();
    }, 100);

    setTimeout(() => {
      expect(banner.find(MyComponent).prop('error')).to.eql(false);
      expect(banner.find(MyComponent).prop('loading')).to.eql(false);
      expect(banner.find(MyComponent).prop('success')).to.eql(false);
      next();
    }, 200);
  });
});
