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
      number: '',
    };
  }

  update(number) {
    this.setState({ number });
  }

  send() {
    const { onSend = () => {} } = this.props; // FIXME: shoud I rename this?
    onSend(this.state.number);
  }

  renderButtons() {
    const { locale, loading, success, onDismiss, onRetry, onSend } = this.props;

    if (loading) {
      return (
        <div>
          <img src="spinner.svg" alt="Loading" />
        </div>
      );
    }

    if (success) {
      return (
        <div>
          <button onClick={onRetry}>{locale.desktop_edit}</button>
          <button onClick={onDismiss}>{locale.desktop_done}</button>
        </div>
      );
    }

    return (
      <div>
        <button onClick={onDismiss}>{locale.desktop_no_thanks}</button>
        <button onClick={() => this.send()}>{locale.desktop_send_link}</button>
      </div>
    );
  }

  render() {
    const { google, apple, onDismiss, onSend, locale, country, loading, placement } = this.props;

    let icon = null;
    if (google && google.icon) {
      icon = google.icon;
    }
    if (apple && apple.icon) {
      icon = apple.icon;
    }

    return (
      <div className={`app-banner-${placement}`}>
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
