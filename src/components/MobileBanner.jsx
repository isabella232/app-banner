import React, { Component } from 'react';
import ElementClass from 'element-class';

import findFixedHeader from '../lib/fixed-header';
import dismiss from '../images/dismiss.svg';
import style from './css/MobileBanner.scss';

function show() {
  ElementClass(document.querySelector('html'))
    .add(style.BannerPresent);
}

function hide() {
  ElementClass(document.querySelector('html'))
    .remove(style.BannerPresent);
}

function fixHeader() {
  const header = findFixedHeader();
  if (header) {
    ElementClass(header).add(style.FixedHeader);
  }
}

export default class MobileBanner extends Component {
  componentDidMount() {
    // cannot call show directly -- reveal transition wont work
    setTimeout(() => {
      show();
      fixHeader();
    }, 100);
  }

  dismiss() {
    const { onDismiss } = this.props;

    hide();
    onDismiss();
  }

  render() {
    const { app, locale } = this.props;
    return (
      <div className={style.banner} id={style.AppBanner}>

        <div className={style.dismiss} onClick={() => this.dismiss()} role="presentation">
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
  }
}

// FIXME: add locale to img alt text
