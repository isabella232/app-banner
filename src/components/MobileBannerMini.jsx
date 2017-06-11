import React, { Component } from 'react';
import ElementClass from 'element-class';

import style from './css/MobileBanner.scss';

const height = 50;

export default class MobileBannerMini extends Component {
  componentDidMount() {
    setTimeout(() => {
      // add some space for the banner and show it
      ElementClass(document.querySelector('html'))
        .add(style.MiniBannerPresent);

      // TODO: fix the fixed headers

      // scroll to the start of the page and hide the banner
      if (window.scrollY === 0) { // not yet scrolled
        window.scrollTo(0, height);
      }
    }, 500);
  }

  render() {
    const { app, locale } = this.props;
    return (
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
  }
}
