import React from 'react';

import PhoneInput from './PhoneInput';

const BadgeApple = ({ url, locale }) => (
  <a href={url}>
    <img alt={locale.get_apple} src="//linkmaker.itunes.apple.com/assets/shared/badges/en-gb/appstore-lrg.svg" />
  </a>
);

const BadgeGoogle = ({ url, locale }) => (
  <a href={url}>
    <img alt={locale.get_google} src="https://play.google.com/intl/ru_ru/badges/images/generic/en_badge_web_generic.png" />
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
        {(google && google.icon) ? <BadgeGoogle url={google.url} locale={locale} /> : null}
        {(apple && apple.icon) ? <BadgeApple url={apple.url} locale={locale} /> : null}

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
