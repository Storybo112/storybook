import glamorous from 'glamorous';
import React from 'react';

const common = {
  color: 'currentColor',
  margin: '0 0 .7em 0',

  '&:last-child': {
    marginBottom: 0,
  },
};

export const styles = {
  h1: {
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.19)',
    fontWeight: 300,
    fontSize: 26,
    ...common,
  },
  h2: {
    fontWeight: 400,
    fontSize: 22,
    borderBottom: '1px solid currentColor',
    ...common,
  },
  h3: {
    fontWeight: 700,
    fontSize: 16,
    ...common,
  },
  h4: {
    fontWeight: 700,
    fontSize: 16,
    ...common,
  },
  h5: {
    fontWeight: 700,
    fontSize: 16,
    ...common,
  },
  h6: {
    fontWeight: 700,
    fontSize: 16,
    ...common,
  },
};

const components = {
  h1: glamorous(({ children, ...props }) => <h1 {...props}>{children}</h1>)(
    ({ as = 'h1' }) => styles[as]
  ),
  h2: glamorous(({ children, ...props }) => <h2 {...props}>{children}</h2>)(
    ({ as = 'h2' }) => styles[as]
  ),
  h3: glamorous(({ children, ...props }) => <h3 {...props}>{children}</h3>)(
    ({ as = 'h3' }) => styles[as]
  ),
  h4: glamorous(({ children, ...props }) => <h4 {...props}>{children}</h4>)(
    ({ as = 'h4' }) => styles[as]
  ),
  h5: glamorous(({ children, ...props }) => <h5 {...props}>{children}</h5>)(
    ({ as = 'h5' }) => styles[as]
  ),
  h6: glamorous(({ children, ...props }) => <h6 {...props}>{children}</h6>)(
    ({ as = 'h6' }) => styles[as]
  ),
};

const DynamicHeading = real => components[real];

export const H1 = DynamicHeading('h1');
export const H2 = DynamicHeading('h2');
export const H3 = DynamicHeading('h3');
export const H4 = DynamicHeading('h4');
export const H5 = DynamicHeading('h5');
export const H6 = DynamicHeading('h6');
