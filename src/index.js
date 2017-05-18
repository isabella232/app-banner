import React from 'react';
import ReactDom from 'react-dom';

import MobileBanner from './src/components/MobileBanner';

ReactDom.render(<Banner />, document.querySelector('#root'));

// TODO: build with release build + uglify-es
// TODO: eslint
// TODO: react -> preact?
// TODO: make jquery embedded