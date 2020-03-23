import React, { CSSProperties } from 'react';

import { IFrame } from './iframe';

export default {
  component: IFrame,
  title: 'UI/Iframe',
};

const style: CSSProperties = {
  width: '500px',
  height: '500px',
  border: '2px solid hotpink',
  position: 'relative',
};

export const workingStory = () => (
  <IFrame
    id="iframe"
    title="Missing"
    src="/iframe.html?id=ui-panel--default"
    allowFullScreen
    style={style}
    scale={1.0}
  />
);

export const missingStory = () => (
  <IFrame
    id="iframe"
    title="Missing"
    src="/iframe.html?id=missing"
    allowFullScreen
    style={style}
    scale={1.0}
  />
);
