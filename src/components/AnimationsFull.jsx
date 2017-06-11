import React, { Component } from 'react';
import ElementClass from 'element-class';

// import findFixedHeader from '../lib/fixed-header';

import style from './css/MobileBanner.scss';

const revealTimeout = 0;
const animationTimeout = 500;

// function fixHeader() {
//   const header = findFixedHeader();
//   if (header) {
//     ElementClass(header).add(style.FixedHeader);
//   }
// }

function show() {
  ElementClass(document.querySelector('html'))
    .add(style.Animated);
  // add some space for the banner and show it
  ElementClass(document.querySelector('html'))
    .add(style.BannerPresent);
}

function hide() {
  ElementClass(document.querySelector('html'))
    .remove(style.BannerPresent);

  setTimeout(() => {
    ElementClass(document.querySelector('html'))
    .remove(style.Animated);
  }, animationTimeout);
}

export default Wrapped => class AnimationsFull extends Component {
  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.timeout = false;

      show();
    }, revealTimeout);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = false;
    }
    hide();
  }

  onDismiss() {
    const { onDismiss } = this.props;
    hide();
    onDismiss();
  }

  render() {
    return (
      <Wrapped {...this.props} onDismiss={() => this.onDismiss()} />
    );
  }
};
