import React from 'react';

const MobileBanner = ({ app, locale, onDismiss }) => (
  <div className="app-banner" id="AppBanner">

    <div className="app-banner__dismiss" onClick={onDismiss} role="presentation">
      <img alt="" src="images/dismiss.svg" />
    </div>

    <a href={app.url} className="app-banner__container">
      <div className="app-banner__img">
        <img alt={app.name} src={app.icon} role="presentation" />
      </div>

      <div className="app-banner__info">
        <div className="app-banner__name">{app.name}</div>
        <div className="app-banner__publisher">{app.publisher}</div>
        <div className="app-banner__cta">{locale.cta}</div>
      </div>

      <div className="app-banner__btn app-banner__btn--fixed">{locale.view}</div>
    </a>
  </div>
);

// FIXME: add locale to img alt text

export default MobileBanner;
