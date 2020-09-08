import React from 'react';

export const decorators = [
  (StoryFn, { globals: { locale = 'en' } }) => (
    <>
      <div>{locale}</div>
      <StoryFn />
    </>
  ),
];

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'es', right: '🇪🇸', title: 'Español' },
        { value: 'zh', right: '🇨🇳', title: '中文' },
        { value: 'ko', right: '🇰🇷', title: '한국어' },
      ],
    },
  },
};
