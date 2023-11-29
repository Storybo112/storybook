/// <reference types="webpack-env" />

import './globals';

export * from './public-types';
export * from './public-helpers';

// optimization: stop HMR propagation in webpack
if (typeof module !== 'undefined') module?.hot?.decline();
