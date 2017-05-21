import React from 'react';

import dismiss from '../images/dismiss.svg';
import s from '../main.scss';

const MobileBanner = ({ app, locale, onDismiss }) => (
  <div className={s.banner} id={s.AppBanner}>

    <div className={s.banner__dismiss} onClick={onDismiss} role="presentation">
      <img alt="" src={dismiss} />
    </div>

    <a href={app.url} className={s.banner__container}>
      <div className={s.banner__img}>
        <img alt={app.name} src={app.icon} role="presentation" />
      </div>

      <div className={s.banner__info}>
        <div className={s.banner__name}>{app.name}</div>
        <div className={s.banner__publisher}>{app.publisher}</div>
        <div className={s.banner__cta}>{locale.cta}</div>
      </div>

      <div className={`${s.banner__btn} ${s.banner__btn__fixed}`}>{locale.view}</div>
    </a>
  </div>
);

// FIXME: add locale to img alt text

export default MobileBanner;
