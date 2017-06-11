import React, { Component } from 'react';
import ElementClass from 'element-class';
import { CSSTransitionGroup } from 'react-transition-group';

// import findFixedHeader from '../lib/fixed-header';

import style from './css/MobileBanner.scss';
import transition from './css/MobileTransition.scss';

const revealTimeout = 0;
const transitionTimeout = 500;

// function fixHeader() {
//   const header = findFixedHeader();
//   if (header) {
//     ElementClass(header).add(style.FixedHeader);
//   }
// }

function show() {
  // add some space for the banner and show it
  ElementClass(document.querySelector('html'))
    .add(style.BannerPresent);
}

function hide() {
  ElementClass(document.querySelector('html'))
    .remove(style.BannerPresent);
}

export default class MobileBannerFull extends Component {
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

  render() {
    const { children } = this.props;

    return (
      <CSSTransitionGroup
        transitionName={transition}
        transitionAppear
        transitionAppearTimeout={transitionTimeout}
        transitionLeaveTimeout={transitionTimeout}
        transitionEnterTimeout={transitionTimeout}
      >
        {children}
      </CSSTransitionGroup>
    );
  }
}
