import React, { Component } from 'react';
import ElementClass from 'element-class';

import style from './css/MobileBanner.scss';

const height = 50;
const revealTimeout = 500;


function show() {
  // add some space for the banner and show it
  ElementClass(document.querySelector('html'))
    .add(style.MiniBannerPresent);

  // TODO: fix the fixed headers

  // scroll to the start of the page and hide the banner
  if (window.scrollY === 0) { // not yet scrolled
    window.scrollTo(0, height);
  }
}

export default class AnimationsMini extends Component {
  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.timeout = false;

      show();
    }, revealTimeout);
  }

  componentWillUnmount() {
    // FIXME: not sure this is required for mini banner
    //        since its never removed from the page
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = false;
    }
  }

  render() {
    const { children } = this.props;

    return children;
  }
}
