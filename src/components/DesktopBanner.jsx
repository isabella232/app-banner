import React from 'react';

import PhoneInput from './PhoneInput';

import spinner from '../images/spinner.svg';
import badgeGp from '../images/gp.svg';

import s from '../main.scss';

const BadgeApple = ({ url, locale }) => (
  <a className={s.banner__badge} href={url}>
    <img
      alt={locale.get_apple}
      src="//linkmaker.itunes.apple.com/assets/shared/badges/en-gb/appstore-lrg.svg"
    />
  </a>
);

const BadgeGoogle = ({ url, locale }) => (
  <a className={s.banner__badge} href={url}>
    <img
      alt={locale.get_google}
      src={badgeGp}
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
    const { onSend = () => {} } = this.props;
    onSend(this.state.number);
  }

  renderButtons() {
    const { locale, loading, success, onDismiss, onRetry } = this.props;

    if (loading) {
      return (
        <div className={s.banner__spinner}>
          <img alt="" src={spinner} />
        </div>
      );
    }

    if (success) {
      return (
        <div className={s.banner__btn_container}>
          <button
            className={`${s.banner__btn} ${s.banner__btn__lg} ${s.banner__btn__link}`}
            onClick={onRetry}
          >
            {locale.desktop_edit}
          </button>
          <button
            className={`${s.banner__btn} ${s.banner__btn__lg}`}
            onClick={onDismiss}
          >
            {locale.desktop_done}
          </button>
        </div>
      );
    }

    return (
      <div className={s.banner__btn_container}>
        <button
          className={`${s.banner__btn} ${s.banner__btn__lg} ${s.banner__btn__link}`}
          onClick={onDismiss}
        >
          {locale.desktop_no_thanks}
        </button>
        <button
          className={`${s.banner__btn} ${s.banner__btn__lg}`}
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
      error,
      placement = 'bottom-right',
    } = this.props;

    let app = null;
    if (google) {
      app = google;
    }
    if (apple) {
      app = apple;
    }

    const className = `${s.banner} ${s.banner__desktop} ${s[`banner__${placement}`]}`;

    return (
      <div id={s.AppBanner} className={className}>
        <div className={s.banner__badge_container}>
          {(google && google.icon) ? <BadgeGoogle url={google.url} locale={locale} /> : null}
          {(apple && apple.icon) ? <BadgeApple url={apple.url} locale={locale} /> : null}
        </div>


        <div className={s.banner__body}>
          <div className={s.banner__header}>
            <div className={s.banner__header_row}>

              <div className={s.banner__img_container}>
                <div className={`${s.banner__img} ${s.banner__img__desktop}`}>
                  <img alt={app.name} src={app.icon} role="presentation" />
                </div>
              </div>

              <div className={s.banner__description}>
                <span><b>{locale.desktop_try}</b></span>
                <p>{locale.desktop_phone}</p>
              </div>
            </div>
          </div>

          <div className={s.banner__input_container}>
            <PhoneInput
              onEnter={() => this.send()}
              onChange={val => this.update(val)}
              country={country}
              placeholder={locale.desktop_phone_placeholder}
              disabled={loading}
              error={error}
            />
          </div>
          {this.renderButtons()}
        </div>
      </div>
    );
  }
}
