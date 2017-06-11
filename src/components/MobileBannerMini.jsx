import React from 'react';

import style from './css/MobileBanner.scss';

const MobileBannerMini = ({ app, locale }) => (
  <div className={style.mini} id={style.AppBanner}>
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

export default MobileBannerMini;
