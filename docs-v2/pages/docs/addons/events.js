import React from 'react';

import Page, { generator } from '../../../components/Page';

import TopNav from '../../../components/TopNav';
import { Content } from '../../../components/Content';

// eslint-disable-next-line no-unused-vars
import * as Markdown from '../../../components/Markdown';
import content from '../../../../addons/events/README.md';

export default generator('AddonEvents', ({ path, query }) => (
  <Page>
    <TopNav {...{ path }} />
    <Content {...{ path, query }}>{content}</Content>
  </Page>
));
