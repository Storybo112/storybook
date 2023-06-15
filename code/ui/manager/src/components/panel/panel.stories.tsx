import React, { useCallback, useEffect, useRef, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Badge, Spaced } from '@storybook/components';
import Panel from './panel';
import { panels, shortcuts } from '../layout/app.mockdata';

const onSelect = action('onSelect');
const toggleVisibility = action('toggleVisibility');
const togglePosition = action('togglePosition');

export default {
  title: 'Panel',
  component: Panel,
};

export const Default = () => {
  const [selectedPanel, setSelectedPanel] = useState('test2');
  return (
    <Panel
      absolute={false}
      panels={panels}
      actions={{ onSelect: setSelectedPanel, toggleVisibility, togglePosition }}
      selectedPanel={selectedPanel}
      shortcuts={shortcuts}
    />
  );
};

export const JSXTitles = () => {
  const [selectedPanel, setSelectedPanel] = useState('function-string');
  return (
    <Panel
      absolute={false}
      panels={{
        'function-string': {
          title: () => 'Test 1',
          render: ({ active, key }) =>
            active ? (
              <div id="test1" key={key}>
                TEST as string
              </div>
            ) : null,
        },
        'function-jsx': {
          title: () => (
            <div>
              <Spaced col={1}>
                <div style={{ display: 'inline-block' }}>Test 1</div>
                <Badge status="critical">4</Badge>
              </Spaced>
            </div>
          ),
          render: ({ active, key }) =>
            active ? (
              <div id="test1" key={key}>
                TEST with label
              </div>
            ) : null,
        },
        'function-jsx-state': {
          title: () => {
            const MAX = 10;
            const [count, setCount] = useState(0);
            const timer = useRef(null);

            const startTimer = useCallback((event) => {
              event.stopPropagation();
              if (timer.current) {
                return;
              }
              timer.current = setInterval(() => {
                setCount((c) => {
                  if (c === MAX) {
                    clearInterval(timer.current);
                    timer.current = null;
                    return c;
                  }
                  return c + 1;
                });
              }, 1000);
            }, []);
            const stopTimer = useCallback((event) => {
              event.stopPropagation();
              if (timer.current) {
                clearInterval(timer.current);
                timer.current = null;
              }
            }, []);

            return (
              <div
                onMouseEnter={startTimer}
                onMouseLeave={stopTimer}
                onBlur={stopTimer}
                tabIndex={-1}
              >
                <Spaced col={1}>
                  <div style={{ display: 'inline-block' }}>Hover over me!</div>
                  {count ? (
                    <Badge status={count > 8 ? 'critical' : 'warning'}>{count}</Badge>
                  ) : null}
                </Spaced>
              </div>
            );
          },
          render: ({ active, key }) => {
            return active ? (
              <div id="test1" key={key}>
                TEST with timer
              </div>
            ) : null;
          },
        },
      }}
      actions={{ onSelect: setSelectedPanel, toggleVisibility, togglePosition }}
      selectedPanel={selectedPanel}
      shortcuts={shortcuts}
    />
  );
};

export const NoPanels = () => (
  <Panel
    panels={{}}
    actions={{ onSelect, toggleVisibility, togglePosition }}
    shortcuts={shortcuts}
  />
);
