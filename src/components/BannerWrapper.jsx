import React, { Component } from 'react';

export default Wrapped => class BannerWrapper extends Component {
  constructor() {
    super();

    this.state = {
      status: 'shown',
    };

    this.timer = undefined;
  }

  onSuccess() {
    const { timeout = 3000 } = this.props;

    this.setState({ status: 'success' });
    this.timer = setTimeout(() => this.dismiss(), timeout);
  }


  onFailure() {
    this.setState({ status: 'error' });
  }

  dismiss() {
    const { onDismiss = () => {} } = this.props;

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

    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    const { status } = this.state;

    if (status === 'hidden') {
      return <div />;
    }

    return (
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
};
