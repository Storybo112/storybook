import { NgStory, NgStoryModule, ngBootstrapStoryModule } from '@storybook/angular';
import { Welcome, Button } from '@storybook/angular/demo';
import { linkTo } from '@storybook/addon-links';

@NgStory({
  kind: 'Story with decorator',
  name: 'to Storybook',
  parameters: {
    template: `<storybook-welcome-component (showApp)="showApp()"></storybook-welcome-component>`,
    props: {
      showApp: linkTo('Button'),
    },
    moduleMetadata: {
      declarations: [Welcome],
    },
  },
})
export class Storybook {}

@NgStory({
  kind: 'Story with decorator',
  name: 'with text',
  parameters: {
    template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
    props: {
      text: 'Hello Button',
      onClick: (event: Event) => {
        console.log('some bindings work');
        console.log(event);
      },
    },
    moduleMetadata: {
      declarations: [Button],
    },
  },
})
export class WithText {}

@NgStory({
  kind: 'Story with decorator',
  name: 'with some emoji',
  parameters: {
    template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
    props: {
      text: '😀 😎 👍 💯',
      onClick: () => {},
    },
    moduleMetadata: {
      declarations: [Button],
    },
  },
})
export class WithSomeEmoji {}

@NgStoryModule({
  name: 'Decorator',
  stories: [Storybook, WithText, WithSomeEmoji],
})
export class StoryModule {}

ngBootstrapStoryModule(StoryModule);
