import React from 'react';

export default Component => class BannerWrapper extends React.Component {
  constructor() {
    super();

    this.state = {
      status: 'shown',
    };
  }

  onSuccess() {
    this.setState({ status: 'success' });
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

  render() {
    const { status } = this.state;

    if (status === 'hidden') {
      return <div />;
    }

    return (
      <Component
        {...this.props}
        loading={status === 'loading'}
        error={status === 'error'}
        success={status === 'success'}
        onDismiss={() => this.dismiss()}
        onSend={value => this.send(value)}
      />
    );
  }
};
