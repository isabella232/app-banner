import React, { Component } from 'react';

import PhoneInput from './PhoneInput';

import spinner from '../images/spinner.svg';
import badgeGp from '../images/gp.svg';

import googleIcon from '../images/google.svg';
import appleIcon from '../images/apple.svg';

import style from './css/DesktopBanner.scss';

const BadgeApple = ({ url, locale }) => (
  <a className={style.badge} href={url}>
    <img
      alt={locale.get_apple}
      src="//linkmaker.itunes.apple.com/assets/shared/badges/en-gb/appstore-lrg.svg"
    />
  </a>
);

const BadgeGoogle = ({ url, locale }) => (
  <a className={style.badge} href={url}>
    <img
      alt={locale.get_google}
      src={badgeGp}
    />
  </a>
);

const Minimized = ({ className, onClick, google, apple }) => {
  const single = (google ^ apple);
  const classN = [
    className,
    single ? style.single : '',
  ].join(' ');

  return (
    <div className={classN} onClick={onClick} role="presentation">
      {apple ? <div><img src={appleIcon} alt="" /></div> : null}
      {google ? <div><img src={googleIcon} alt="" /></div> : null}
    </div>
  );
};

export default class DesktopBanner extends Component {
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
        <div className={style.spinner}>
          <img alt="" src={spinner} />
        </div>
      );
    }

    if (success) {
      return (
        <div className={style.btn_container}>
          <button
            className={`${style.btn} ${style.btn__lg} ${style.btn__link}`}
            onClick={onRetry}
          >
            {locale.desktop_edit}
          </button>
          <button
            className={`${style.btn} ${style.btn__lg}`}
            onClick={onDismiss}
          >
            {locale.desktop_done}
          </button>
        </div>
      );
    }

    return (
      <div className={style.btn_container}>
        <button
          className={`${style.btn} ${style.btn__lg} ${style.btn__link}`}
          onClick={onDismiss}
        >
          {locale.desktop_no_thanks}
        </button>
        <button
          className={`${style.btn} ${style.btn__lg}`}
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
      placement,
      minimized,
      onShow,
    } = this.props;

    let app = null;
    if (google) {
      app = google;
    }
    if (apple) {
      app = apple;
    }

    const className = [
      style.banner,
      style[placement],
      (minimized ? style.minimized : ''),
    ].join(' ');

    if (minimized) {
      return (
        <Minimized
          className={className}
          onClick={onShow}
          google={!!google}
          apple={!!apple}
        />
      );
    }

    return (
      <div className={className}>
        <div className={style.badge_container}>
          {(google && google.icon) ? <BadgeGoogle url={google.url} locale={locale} /> : null}
          {(apple && apple.icon) ? <BadgeApple url={apple.url} locale={locale} /> : null}
        </div>


        <div className={style.body}>
          <div className={style.header}>
            <div className={style.header_row}>

              <div className={style.img__container}>
                <div className={`${style.img} ${style.img__desktop}`}>
                  <img alt={app.name} src={app.icon} role="presentation" />
                </div>
              </div>

              <div className={style.description}>
                <span><b>{locale.desktop_try}</b></span>
                <p>{locale.desktop_phone}</p>
              </div>
            </div>
          </div>

          <div className={style.input_container}>
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
