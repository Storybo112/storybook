import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import { monoFonts } from '@storybook/components';

const Code = glamorous(({ html, className }) => (
  <code
    className={['prism-code'].concat(className).join(' ')}
    dangerouslySetInnerHTML={{ __html: html }}
  />
))({
  whiteSpace: 'pre',
  overflow: 'auto',
  background: '#333',
  display: 'block',
  color: '#C5C8C6',
  padding: '0.5rem',
  boxSizing: 'border-box',
  verticalAlign: 'baseline',
  outline: 'none',
  textShadow: 'none',
  hyphens: 'none',
  wordWrap: 'normal',
  wordBreak: 'normal',
  textAlign: 'left',
  wordSpacing: 'normal',
  tabSize: 2,
  fontSize: '0.8rem',
  fontFamily: monoFonts.fontFamily,
  fontFeatureSettings: '"calt" 1',
  fontWeight: 300,
  borderRadius: 3,
  boxShadow: '1px 1px 20px rgba(20, 20, 20, 0.27)',

  'p > &': {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
  },
  'div > &': {
    display: 'block',
    marginBottom: 20,
  },
});
Code.displayName = 'Markdown.Code';
Code.propTypes = {
  className: PropTypes.string,
  html: PropTypes.string.isRequired,
};
Code.defaultProps = {
  className: undefined,
};

export { Code as default };
