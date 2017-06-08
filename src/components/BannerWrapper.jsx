import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';


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
    
    show() {
      this.setState({ status: 'shown' });      
    }

    render() {
      const { transition, ...rest } = this.props;
      const { status } = this.state;

      let content = null;

      if (status !== 'hidden') {
        content = (
          <Wrapped
            {...rest}
            key="shown"
            loading={status === 'loading'}
            error={status === 'error'}
            success={status === 'success'}
            onDismiss={() => this.dismiss()}
            onSend={value => this.send(value)}
            onRetry={() => this.retry()}
          />
        );
      } else {
        content = (
          <Wrapped 
            {...rest}
            key="hidden"
            minimized
            onShow={() => this.show()}
          />
        )
      }

      if (!transition) {
        return content;
      }

      return (
        <CSSTransitionGroup
          transitionName={transition}
          transitionAppear
          transitionAppearTimeout={5000}
          transitionLeaveTimeout={5000}
          transitionEnterTimeout={5000}
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
    onDismiss: () => {},
  };

  return BannerWrapper;
};
