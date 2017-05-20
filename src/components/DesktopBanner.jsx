import React from 'react';

import PhoneInput from './PhoneInput';

import spinner from '../../dist/images/spinner.svg';

const BadgeApple = ({ url, locale }) => (
  <a className="app-banner__badge" href={url}>
    <img
      alt={locale.get_apple}
      src="//linkmaker.itunes.apple.com/assets/shared/badges/en-gb/appstore-lrg.svg"
    />
  </a>
);

const BadgeGoogle = ({ url, locale }) => (
  <a className="app-banner__badge" href={url}>
    <img
      alt={locale.get_google}
      src="images/badge-gp-en.png"
    />
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
    const { locale, loading, success, onDismiss, onRetry } = this.props;

    if (loading) {
      return (
        <div className="app-banner__spinner">
          <img alt="" src={spinner} />
        </div>
      );
    }

    if (success) {
      return (
        <div className="app-banner__btn-container">
          <button
            className="app-banner__btn app-banner__btn--lg app-banner__btn--link"
            onClick={onRetry}
          >
            {locale.desktop_edit}
          </button>
          <button
            className="app-banner__btn app-banner__btn--lg"
            onClick={onDismiss}
          >
            {locale.desktop_done}
          </button>
        </div>
      );
    }

    return (
      <div className="app-banner__btn-container">
        <button
          className="app-banner__btn app-banner__btn--lg app-banner__btn--link"
          onClick={onDismiss}
        >
          {locale.desktop_no_thanks}
        </button>
        <button
          className="app-banner__btn app-banner__btn--lg"
          onClick={() => this.send()}
        >
          {locale.desktop_send_link}
        </button>
      </div>
    );
  }

  render() {
    const {
      google,
      apple,
      locale,
      country,
      loading,
      placement = 'bottom-right',
    } = this.props;

    let app = null;
    if (google) {
      app = google;
    }
    if (apple) {
      app = apple;
    }

    const className = `app-banner app-banner--desktop app-banner--${placement}`;

    return (
      <div id="AppBanner" className={className}>
        <div className="app-banner__badge-container">
          {(google && google.icon) ? <BadgeGoogle url={google.url} locale={locale} /> : null}
          {(apple && apple.icon) ? <BadgeApple url={apple.url} locale={locale} /> : null}
        </div>


        <div className="app-banner__body">
          <div className="app-banner__header">
            <div className="app-banner__header-row">

              <div className="app-banner__img-container">
                <div className="app-banner__img app-banner__img--desktop">
                  <img alt={app.name} src={app.icon} role="presentation" />
                </div>
              </div>

              <div className="app-banner__description">
                <span><b>{locale.desktop_try}</b></span>
                <p>{locale.desktop_phone}</p>
              </div>
            </div>
          </div>

          <div className="app-banner__input-container">
            <PhoneInput
              onEnter={() => this.send()}
              onChange={val => this.update(val)}
              country={country}
              placeholder={locale.desktop_phone_placeholder}
              disabled={loading}
            />
          </div>
          {this.renderButtons()}
        </div>
      </div>
    );
  }
}
