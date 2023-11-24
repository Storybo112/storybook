---
title: 'Toolbar'
---

Storybook’s toolbar appears at the top of stories and docs pages. It displays menus from addons that can customize the preview environment, like the [viewport](../essentials/viewport.md) and [background](../essentials/backgrounds.md)) addons, as well as [custom menus](../essentials/toolbars-and-globals.md#global-types-and-the-toolbar-annotation) you've defined.

### Conditionally show toolbar

By default, the toolbar is visible on every page, and users can choose to hide it with a keyboard shortcut.

If you need, you can customize when the toolbar appears. For example. this configuration will always hide it on docs pages:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-manager-hide-toolbar-on-docs.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

The following parameters are available to the `showToolbar` function:


| Name                     | Type     | Description                                                    | Example Value                         |
| ------------------------ | -------- | -------------------------------------------------------------- | ------------------------------------- |
| **path**                 | String   | Path to the page being displayed                               | `'/story/components-button--default'` |
| **viewMode**             | String   | Whether the current page is a story or docs                    | `'docs'` or `'story'`                 |
| **singleStory**          | Boolean  | Whether the current page is the only story for a component     | `true` or `false`                     |
| **storyId**              | String   | The id of the current story or docs page                       | `'blocks-blocks-unstyled--docs'`      |
| **layout**               | Object   | The current layout state                                       | *see below*                           |
| **layout.isFullscreen**  | Boolean  | Whether the preview canvas is in fullscreen mode               | `true` or `false`                     |
| **layout.panelPosition** | String   | Whether the panel is shown below or on the side of the preview | `'bottom'` or `'right'`               |
| **layout.showNav**       | Boolean  | The setting controlling sidebar visibility                     | `true` or `false`                     |
| **layout.showPanel**     | Boolean  | The setting controlling panel visibility                       | `true` or `false`                     |
| **layout.showToolbar**   | Boolean  | The setting controlling toolbar visibility                     | `true` or `false`                     |

### Keyboard shortcuts

- Show or hide toolbar: <kbd>t</kbd>
