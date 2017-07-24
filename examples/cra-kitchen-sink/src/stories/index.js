import React from 'react';
import EventEmiter from 'eventemitter3';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { addonNotes, WithNotes, withNotes } from '@storybook/addon-notes';
import { linkTo } from '@storybook/addon-links';
import WithEvents from '@storybook/addon-events';
import {
  withKnobs,
  addonKnobs,
  text,
  number,
  boolean,
  color,
  select,
  array,
  date,
  object,
} from '@storybook/addon-knobs';
import centered from '@storybook/addon-centered';
import { withInfo, addInfo } from '@storybook/addon-info';

import { Button, Welcome } from '@storybook/react/demo';

import App from '../App';
import Logger from './Logger';

const EVENTS = {
  TEST_EVENT_1: 'test-event-1',
  TEST_EVENT_2: 'test-event-2',
  TEST_EVENT_3: 'test-event-3',
  TEST_EVENT_4: 'test-event-4',
};

const emiter = new EventEmiter();
const emit = emiter.emit.bind(emiter);

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

const InfoButton = () =>
  <span
    style={{
      fontFamily: 'sans-serif',
      fontSize: 12,
      textDecoration: 'none',
      background: 'rgb(34, 136, 204)',
      color: 'rgb(255, 255, 255)',
      padding: '5px 15px',
      margin: 10,
      borderRadius: '0px 0px 0px 5px',
    }}
  >
    {' '}Show Info{' '}
  </span>;

const withBorder = (storyFn, context, bcolor) =>
  <div style={{ padding: 6, border: `${bcolor} solid 2px` }}>
    {storyFn()}
  </div>;

storiesOf('Button', module)
  .getAddons(addInfo, withNotes, withBorder)
  .add('with addons', context =>
    context
      .storyOf(
        <Button>
          Context is a key. Do you want to know more about "{context.kind}/{context.story}"?
        </Button>
      )
      .withNotes('Addons composition')
      .withBorder('red')
      .addInfo('Addons composition', { inline: false })
  )
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>)
  .add('with notes', () =>
    <WithNotes notes={'A very simple button'}>
      <Button>Check my notes in the notes panel</Button>
    </WithNotes>
  )
  .add(
    'with new info',
    withInfo(
      'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its new painless API.'
    )(context =>
      <div>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </div>
    )
  )
  .add(
    'addons composition',
    withInfo('see Notes panel for composition info')(
      addonNotes({ notes: 'Composition: Info(Notes())' })(context =>
        <div>
          click the <InfoButton /> label in top right for info about "{context.story}"
        </div>
      )
    )
  );

storiesOf('App', module).add('full app', () => <App />);

storiesOf('Centered Button', module)
  .addDecorator(centered)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>);

storiesOf('WithEvents', module)
  .addDecorator(getStory =>
    <WithEvents
      emit={emit}
      events={[
        {
          name: EVENTS.TEST_EVENT_1,
          title: 'Test event 1',
          payload: 0,
        },
        {
          name: EVENTS.TEST_EVENT_2,
          title: 'Test event 2',
          payload: 'Test event 2',
        },
        {
          name: EVENTS.TEST_EVENT_3,
          title: 'Test event 3',
          payload: {
            string: 'value',
            number: 123,
            array: [1, 2, 3],
            object: {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
          },
        },
        {
          name: EVENTS.TEST_EVENT_4,
          title: 'Test event 4',
          payload: [
            {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
            {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
            {
              string: 'value',
              number: 123,
              array: [1, 2, 3],
            },
          ],
        },
      ]}
    >
      {getStory()}
    </WithEvents>
  )
  .add('Logger', () => <Logger emiter={emiter} />);

storiesOf('addonNotes', module)
  .add('with some text', addonNotes({ notes: 'Hello guys' })(() => <div>Hello guys</div>))
  .add('with some emoji', addonNotes({ notes: 'My notes on emojies' })(() => <p>🤔😳😯😮</p>))
  .add(
    'with a button and some emoji',
    addonNotes({ notes: 'My notes on a button with emojies' })(() =>
      <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
    )
  )
  .add('with old API', () =>
    <WithNotes notes="Hello">
      <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
    </WithNotes>
  );

storiesOf('Addon Knobs deprecated Decorator', module)
  .addDecorator(withKnobs) // test deprecated
  .add('with dynamic variables deprecated', () => {
    const name = text('Name', 'Story Teller');
    const age = number('Age', 120);

    const content = `I am ${name} and I'm ${age} years old.`;
    return (
      <div>
        {content}
      </div>
    );
  });

storiesOf('Addon Knobs', module).add(
  'with dynamic variables new method',
  addonKnobs()(() => {
    const name = text('Name', 'Arunoda Susiripala');
    const age = number('Age', 89);

    const content = `I am ${name} and I'm ${age} years old.`;
    return (
      <div>
        {content}
      </div>
    );
  })
);

storiesOf('component.base.Link')
  .addDecorator(withKnobs)
  .add('first', () =>
    <a>
      {text('firstLink', 'first link')}
    </a>
  )
  .add('second', () =>
    <a>
      {text('secondLink', 'second link')}
    </a>
  );

storiesOf('component.base.Span')
  .add('first', () => <span>first span</span>)
  .add('second', () => <span>second span</span>);

storiesOf('component.common.Div')
  .add('first', () => <div>first div</div>)
  .add('second', () => <div>second div</div>);

storiesOf('component.common.Table')
  .add('first', () =>
    <table>
      <tr>
        <td>first table</td>
      </tr>
    </table>
  )
  .add('second', () =>
    <table>
      <tr>
        <td>first table</td>
      </tr>
    </table>
  );

storiesOf('component.Button')
  .add('first', () => <button>first button</button>)
  .add('second', () => <button>first second</button>);

// Atomic

storiesOf('Cells¯\\_(ツ)_/¯Molecules.Atoms/simple', module)
  .addDecorator(withKnobs)
  .add('with text', () =>
    <Button>
      {text('buttonText', 'Hello Button')}
    </Button>
  )
  .add('with some emoji', () => <Button>😀 😎 👍 💯</Button>);

storiesOf('Cells/Molecules/Atoms.more', module)
  .add('with text2', () => <Button>Hello Button</Button>)
  .add('with some emoji2', () => <Button>😀 😎 👍 💯</Button>);

storiesOf('Cells/Molecules', module)
  .add('with text', () => <Button>Hello Button</Button>)
  .add('with some emoji', () => <Button>😀 😎 👍 💯</Button>);

storiesOf('Cells.Molecules.Atoms', module)
  .add('with text2', () => <Button>Hello Button</Button>)
  .add('with some emoji2', () => <Button>😀 😎 👍 💯</Button>);
