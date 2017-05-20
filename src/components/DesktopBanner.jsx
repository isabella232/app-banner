import React from 'react';

import PhoneInput from './PhoneInput';

const BadgeApple = ({ url }) => (
  <a href={url}>
    <img alt="" src="some icon" />
  </a>
);

const BadgeGoogle = ({ url }) => (
  <a href={url}>
    <img alt="" src="some icon" />
  </a>
);

export default class DesktopBanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dismissed: false,
      number: '',
      loading: false,
    };
  }

  dismiss() {
    const { onDismiss } = this.props;

    this.setState({ dismissed: true });
    onDismiss();
  }

  update(number) {
    this.setState({ number });
  }

  send() {
    const { onSend = () => {} } = this.props; // FIXME: shoud I rename this?

    this.setState({ loading: true });

    onSend(this.state.number);
  }

  renderButtons() {
    const { locale } = this.props;
    const { loading } = this.state;

    if(loading) {
      return (
        <div>
          <img src="spinner.svg" alt="Loading" />
        </div>
      );
    }

    return (
      <div>
        <button onClick={() => this.dismiss()}>{locale.desktop_no_thanks}</button>
        <button onClick={() => this.send()}>{locale.desktop_send_link}</button>
      </div>
    );
  }

  render() {
    const { google, apple, onDismiss, onSend, locale, country } = this.props;
    const { dismissed, loading } = this.state;

    let icon = null;
    if (google && google.icon) {
      icon = google.icon;
    }
    if (apple && apple.icon) {
      icon = apple.icon;
    }

    if (dismissed) {
      return null;
    }

    return (
      <div>
        {(google && google.icon) ? <BadgeGoogle url={google.url} /> : null}
        {(apple && apple.icon) ? <BadgeApple url={apple.url} /> : null}

        <img src={icon} alt="" />
        {locale.desktop_try}
        {locale.desktop_phone}
        <PhoneInput
          onEnter={() => this.send()}
          onChange={val => this.update(val)}
          country={country}
          placeholder={locale.desktop_phone_placeholder}
          disabled={loading}
        />
        {this.renderButtons()}
      </div>
    );
  }
}
