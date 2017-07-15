import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';


export default (Wrapped) => {
  class BannerWrapper extends Component {
    constructor(props) {
      const { minimized } = props;

      super(props);

      this.state = {
        status: minimized ? 'minimized' : 'shown',
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
      const { minimize } = this.props;

      const status = minimize ? 'minimized' : 'hidden';

      this.setState({ status });

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

    show() {
      this.setState({ status: 'shown' });
    }

    render() {
      const { transition, transitionTimeout, ...rest } = this.props;
      const { status } = this.state;

      let content = null;

      const key = (status === 'minimized') ? 'minimized' : 'shown';

      if (status === 'hidden') {
        content = null;
      } else {
        content = (
          <Wrapped
            {...rest}
            key={key}
            loading={status === 'loading'}
            error={status === 'error'}
            success={status === 'success'}
            minimized={status === 'minimized'}
            onDismiss={() => this.dismiss()}
            onSend={value => this.send(value)}
            onRetry={() => this.retry()}
            onShow={() => this.show()}
          />
        );
      }

      if (!transition) {
        return content;
      }

      // NOTE: we need to use CSSTransitionGroup here, otherwise the CSSTransitionGroup component
      //       will be recreated on each render and animations wont work
      //       (or i'm doing something wrong)
      return (
        <CSSTransitionGroup
          transitionName={transition}
          transitionAppear
          transitionAppearTimeout={transitionTimeout}
          transitionLeaveTimeout={transitionTimeout}
          transitionEnterTimeout={transitionTimeout}
        >
          {content}
        </CSSTransitionGroup>
      );
    }
  }

  // FIXME: It's better to use static class properties in class def. above.
  //        However using them makes my eslint crazy, so i'll use this for a while.
  BannerWrapper.defaultProps = {
    timeout: 3000,
    transitionTimeout: 500,
    onDismiss: () => {},
  };

  return BannerWrapper;
};
