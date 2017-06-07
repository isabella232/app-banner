import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import style from './css/AppBanner.scss';

export default (Wrapped) => {
  class BannerWrapper extends Component {
    constructor() {
      super();

      this.state = {
        status: 'shown',
      };

      this.timer = undefined;
    }

    componentWillUnmount() {
      this.removeTimer();
    }

    onSuccess() {
      const { timeout } = this.props;

      this.setState({ status: 'success' });
      this.timer = setTimeout(() => this.dismiss(), timeout);
    }

    onFailure() {
      this.setState({ status: 'error' });
    }

    removeTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }
    }

    dismiss() {
      const { onDismiss } = this.props;

      this.setState({ status: 'hidden' });

      onDismiss();
    }

    send(value) {
      const { sender } = this.props;

      this.setState({ status: 'loading' });

      const promise = sender(value);
      if (promise) {
        promise
          .then(() => this.onSuccess())
          .catch(() => this.onFailure());
      }
    }

    retry() {
      this.setState({ status: 'shown' });
      this.removeTimer();
    }

    render() {
      const { status } = this.state;

      let content = null;
      if (status !== 'hidden') {
        content = (
          <Wrapped
            {...this.props}
            loading={status === 'loading'}
            error={status === 'error'}
            success={status === 'success'}
            onDismiss={() => this.dismiss()}
            onSend={value => this.send(value)}
            onRetry={() => this.retry()}
          />
        );
      }

      return (
        <CSSTransitionGroup
          transitionName={{
            appear: style.appear,
            appearActive: style.appearActive,
            leave: style.leave,
            leaveActive: style.leaveActive,
          }}
          transitionAppear
        >
          {content}
        </CSSTransitionGroup>
      );
    }
  }

  // FIXME: it's better to use static class properties in class def. above
  //        however using them makes my eslint crazy, so i'll use this for a while
  BannerWrapper.defaultProps = {
    timeout: 3000,
    onDismiss: () => {},
  };

  return BannerWrapper;
};
