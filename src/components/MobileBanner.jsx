import React from 'react';

const MobileBanner = ({ url, app, locale, onDismiss }) => (
  <div>
    <img alt="" src="dismiss.svg" onClick={onDismiss} />
    {app.name}
    {app.publisher}
    <a href={app.url}>
      <img alt="" src={app.icon} />
      {locale.cta}
      {locale.view}
    </a>
  </div>
);

export default MobileBanner;
