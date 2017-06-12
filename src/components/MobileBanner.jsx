import React from 'react';

import dismiss from '../images/dismiss.svg';
import style from './css/MobileBanner.scss';

const MobileBannerFull = ({ app, locale, onDismiss }) => (
  <div className={style.banner} id={style.AppBanner}>

    <div className={style.dismiss} onClick={onDismiss} role="presentation">
      <img alt="" src={dismiss} />
    </div>

    <a href={app.url} className={style.container}>
      <div className={style.img}>
        <img alt={app.name} src={app.icon} role="presentation" />
      </div>

      <div className={style.info}>
        <div className={style.name}>{app.name}</div>
        <div className={style.publisher}>{app.publisher}</div>
        <div className={style.cta}>{locale.cta}</div>
      </div>

      <div className={`${style.btn} ${style.btn__fixed}`}>{locale.view}</div>
    </a>
  </div>
);

const MobileBannerMini = ({ app, locale }) => (
  <div className={style.mini} id={style.TheBanner}>
    <a href={app.url} className={style.container}>
      <div className={style.img}>
        <img alt={app.name} src={app.icon} role="presentation" />
      </div>

      <div className={style.info}>
        <div className={style.name}>{app.name}</div>
        <div className={style.cta}>{locale.cta}</div>
      </div>

      <div className={`${style.btn} ${style.btn__fixed}`}>{locale.view}</div>
    </a>
  </div>
);

const MobileBanner = ({ minimized, ...rest }) =>
  (minimized ? MobileBannerMini(rest) : MobileBannerFull(rest));

export default MobileBanner;
