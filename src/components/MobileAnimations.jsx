import React, { Component } from 'react';
import ElementClass from 'element-class';
import style from './css/MobileBanner.scss';

const animationTimeout = 500;

// TRICKY: Here we detect all existing elements that appear like headers and apply
//         the FixedHeader style on them. That (with astonishing power of the
//         html.BannerPresent style) theoretically should make everything on the page
//         just shift $bannerHeight pixels lower and free some empty space for our banner.
function fixHeader() {
  const all = document.querySelectorAll('*').values();
  for (const e of all) {
    const s = window.getComputedStyle(e);
    if (s.position === 'fixed') {
      const classes = ElementClass(e);
      if (!classes.has(style.banner) && !classes.has(style.mini)) {
        classes.add(style.FixedHeader);
      }
    }
  }
}

function showFull() {
  ElementClass(document.querySelector('html'))
    .add(style.Animated);

  fixHeader();
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

const height = 50;

function showMini() {
  // add some space for the banner and show it
  ElementClass(document.querySelector('html'))
    .add(style.MiniBannerPresent);

  // TODO: fix the fixed headers
  fixHeader();

  // scroll to the start of the page and hide the banner
  if (window.scrollY === 0) { // not yet scrolled
    window.scrollTo(0, height);
  }
}

function hideMini() {

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
