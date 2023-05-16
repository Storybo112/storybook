import type { AnchorHTMLAttributes, FC, MouseEvent } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';
import { darken } from 'polished';

import { Icons } from '../../icon/icon';

// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behavior. Same applies to non-left clicks
const LEFT_BUTTON = 0;

const isPlainLeftClick = (e: MouseEvent) =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

const cancelled = (e: MouseEvent, cb: (_e: MouseEvent) => void) => {
  if (isPlainLeftClick(e)) {
    e.preventDefault();
    cb(e);
  }
};

export interface LinkStylesProps {
  secondary?: boolean;
  tertiary?: boolean;
  nochrome?: boolean;
  inverse?: boolean;
  isButton?: boolean;
}

export interface LinkInnerProps {
  withArrow?: boolean;
  containsIcon?: boolean;
}

const LinkInner = styled.span<LinkInnerProps>(
  ({ withArrow }: any) =>
    withArrow
      ? {
          '> svg:last-of-type': {
            height: '0.7em',
            width: '0.7em',
            marginRight: 0,
            marginLeft: '0.25em',
            bottom: 'auto',
            verticalAlign: 'inherit',
          },
        }
      : {},
  ({ containsIcon }: any) =>
    containsIcon
      ? {
          svg: {
            height: '1em',
            width: '1em',
            verticalAlign: 'middle',
            position: 'relative',
            bottom: 0,
            marginRight: 0,
          },
        }
      : {}
);

type AProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const A = styled.a<LinkStylesProps>(
  ({ theme }: any) => ({
    display: 'inline-block',
    transition: 'all 150ms ease-out',
    textDecoration: 'none',

    color: theme.color.secondary,

    '&:hover, &:focus': {
      cursor: 'pointer',
      color: darken(0.07, theme.color.secondary),
      'svg path': {
        fill: darken(0.07, theme.color.secondary),
      },
    },
    '&:active': {
      color: darken(0.1, theme.color.secondary),
      'svg path': {
        fill: darken(0.1, theme.color.secondary),
      },
    },

    svg: {
      display: 'inline-block',
      height: '1em',
      width: '1em',
      verticalAlign: 'text-top',
      position: 'relative',
      bottom: '-0.125em',
      marginRight: '0.4em',

      '& path': {
        fill: theme.color.secondary,
      },
    },
  }),
  ({ theme, secondary, tertiary }: any) => {
    let colors;
    if (secondary) {
      colors = [theme.textMutedColor, theme.color.dark, theme.color.darker];
    }
    if (tertiary) {
      colors = [theme.color.dark, theme.color.darkest, theme.textMutedColor];
    }

    return colors
      ? {
          color: colors[0],
          'svg path': {
            fill: colors[0],
          },

          '&:hover': {
            color: colors[1],
            'svg path': {
              fill: colors[1],
            },
          },

          '&:active': {
            color: colors[2],
            'svg path': {
              fill: colors[2],
            },
          },
        }
      : {};
  },
  ({ nochrome }: any) =>
    nochrome
      ? {
          color: 'inherit',

          '&:hover, &:active': {
            color: 'inherit',
            textDecoration: 'underline',
          },
        }
      : {},
  ({ theme, inverse }: any) =>
    inverse
      ? {
          color: theme.color.lightest,
          'svg path': {
            fill: theme.color.lightest,
          },

          '&:hover': {
            color: theme.color.lighter,
            'svg path': {
              fill: theme.color.lighter,
            },
          },

          '&:active': {
            color: theme.color.light,
            'svg path': {
              fill: theme.color.light,
            },
          },
        }
      : {},
  ({ isButton }: any) =>
    isButton
      ? {
          border: 0,
          borderRadius: 0,
          background: 'none',
          padding: 0,
          fontSize: 'inherit',
        }
      : {}
);

export interface LinkProps extends LinkInnerProps, LinkStylesProps {
  cancel?: boolean;
  className?: string;
  style?: object;
  onClick?: (e: MouseEvent) => void;
  href?: string;
}

export const Link: FC<LinkProps & AProps> = ({
  cancel,
  children,
  onClick,
  withArrow,
  containsIcon,
  className,
  ...rest
}) => (
  <A
    {...rest}
    onClick={onClick && cancel ? (e: any) => cancelled(e, onClick) : onClick}
    className={className}
  >
    <LinkInner withArrow={withArrow} containsIcon={containsIcon}>
      {children}
      {withArrow && <Icons icon="arrowright" />}
    </LinkInner>
  </A>
);

Link.defaultProps = {
  cancel: true,
  className: undefined,
  style: undefined,
  onClick: undefined,
  withArrow: false,
  containsIcon: false,
};
