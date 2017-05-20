import React from 'react';
import ReactDom from 'react-dom';

import MobileBanner  from './components/MobileBanner';
import DesktopBanner from './components/DesktopBanner';
import BannerWrapper from './components/BannerWrapper';

ReactDom.render(<div>hello</div>, document.querySelector('#root'));

// TODO: release build with uglify-es and preact

