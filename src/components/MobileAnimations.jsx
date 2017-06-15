import React, { Component } from 'react';
import ElementClass from 'element-class';
import style from './css/MobileBanner.scss';

const animationTimeout = 500;
const miniBannerHeight = 50;

// TRICKY: Here we detect all existing elements that appear like headers and apply
//         the FixedHeader style on them. That (with astonishing power of the
//         html.BannerPresent style) theoretically should make everything on the page
//         just shift $bannerHeight pixels lower and free some empty space for our banner.
function addStyleToAllHeaders(cls) {
  const all = document.querySelectorAll('*').values();
  for (const e of all) {
    const s = window.getComputedStyle(e);
    if (s.position === 'fixed') {
      const classes = ElementClass(e);
      if (!classes.has(style.banner)) {
        classes.add(cls);
      }
    }
  }
}

function showFull() {
  ElementClass(document.querySelector('html'))
    .add(style.Animated);

  addStyleToAllHeaders(style.FixedHeader);

  // add some space for the banner and show it
  ElementClass(document.querySelector('html'))
    .add(style.BannerPresent);
}

function hideFull() {
  ElementClass(document.querySelector('html'))
    .remove(style.BannerPresent);

  setTimeout(() => {
    ElementClass(document.querySelector('html'))
    .remove(style.Animated);
  }, animationTimeout);
}

// Find CSS table with given css selector specification
function findCss(selector) {
  for (const i in document.styleSheets) {
    const ss = document.styleSheets[i];
    for (const j in ss.rules) {
      const rule = ss.rules[j];
      if (rule.selectorText === selector) {
        return rule;
      }
    }
  }
  return null;
}

// handles onscroll event and updates the offset for all header elements
function addScrollHandler() {
  const selector = `html.${style.MiniBannerPresent} .${style.FixedHeader}`;
  const css = findCss(selector);

  if (!css) {
    return;
  }

  const old = window.onscroll;

  const onscroll = (e) => {
    const pos = Math.min(Math.max(0, miniBannerHeight - window.scrollY), miniBannerHeight);
    css.style.marginTop = `${pos}px`;

    if (old) {
      old(e);
    }
  };

  onscroll(); // call handler before the first scroll
  window.onscroll = onscroll;
}

function showMini() {
  // add some space for the banner and show it
  ElementClass(document.querySelector('html'))
   .add(style.MiniBannerPresent);

  addStyleToAllHeaders(style.FixedHeader);
  addScrollHandler();

  // scroll to the start of the page and hide the banner
  if (window.scrollY === 0) { // not yet scrolled
    window.scrollTo(0, miniBannerHeight);
  }
}

function hideMini() {
  // not doing anything since mini banner is not dismissable for now
}


export default Wrapped => class MobileAnimations extends Component {
  componentDidMount() {
    const { minimized } = this.props;
    const revealTimeout = minimized ? 500 : 0;

    this.timeout = setTimeout(() => {
      this.timeout = false;

      this.show();
    }, revealTimeout);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = false;
    }

    this.hide();
  }

  onDismiss() {
    const { onDismiss } = this.props;

    this.hide();
    onDismiss();
  }

  show() {
    const { minimized } = this.props;

    if (minimized) {
      showMini();
    } else {
      showFull();
    }
  }

  hide() {
    const { minimized } = this.props;

    if (minimized) {
      hideMini();
    } else {
      hideFull();
    }
  }

  render() {
    return (
      <Wrapped {...this.props} onDismiss={() => this.onDismiss()} />
    );
  }
};
