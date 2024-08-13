/* eslint-disable no-underscore-dangle */

/* eslint-disable @typescript-eslint/naming-convention */
import type {
  Args,
  Canvas,
  ComponentAnnotations,
  ComposeStoryFn,
  ComposedStoryFn,
  LegacyStoryAnnotationsOrFn,
  NamedOrDefaultProjectAnnotations,
  Parameters,
  PreparedStory,
  ProjectAnnotations,
  RenderContext,
  Renderer,
  Store_CSFExports,
  StoryContext,
  StrictArgTypes,
} from '@storybook/core/types';
import { type CleanupCallback, isExportStory } from '@storybook/csf';

import { MountMustBeDestructuredError } from '@storybook/core/preview-errors';

import { dedent } from 'ts-dedent';

import { HooksContext } from '../../../addons';
import { composeConfigs } from './composeConfigs';
import { getValuesFromArgTypes } from './getValuesFromArgTypes';
import { normalizeComponentAnnotations } from './normalizeComponentAnnotations';
import { normalizeProjectAnnotations } from './normalizeProjectAnnotations';
import { normalizeStory } from './normalizeStory';
import { prepareContext, prepareStory } from './prepareStory';

let globalProjectAnnotations: ProjectAnnotations<any> = {};

const DEFAULT_STORY_TITLE = 'ComposedStory';
const DEFAULT_STORY_NAME = 'Unnamed Story';

function extractAnnotation<TRenderer extends Renderer = Renderer>(
  annotation: NamedOrDefaultProjectAnnotations<TRenderer>
) {
  if (!annotation) return {};
  // support imports such as
  // import * as annotations from '.storybook/preview'
  // import annotations from '.storybook/preview'
  // in both cases: 1 - the file has a default export; 2 - named exports only
  return 'default' in annotation ? annotation.default : annotation;
}

export function setProjectAnnotations<TRenderer extends Renderer = Renderer>(
  projectAnnotations:
    | NamedOrDefaultProjectAnnotations<TRenderer>
    | NamedOrDefaultProjectAnnotations<TRenderer>[]
): ProjectAnnotations<TRenderer> {
  const annotations = Array.isArray(projectAnnotations) ? projectAnnotations : [projectAnnotations];
  globalProjectAnnotations = composeConfigs(annotations.map(extractAnnotation));

  return globalProjectAnnotations;
}

const cleanups: CleanupCallback[] = [];

export function composeStory<TRenderer extends Renderer = Renderer, TArgs extends Args = Args>(
  storyAnnotations: LegacyStoryAnnotationsOrFn<TRenderer>,
  componentAnnotations: ComponentAnnotations<TRenderer, TArgs>,
  projectAnnotations?: ProjectAnnotations<TRenderer>,
  defaultConfig?: ProjectAnnotations<TRenderer>,
  exportsName?: string
): ComposedStoryFn<TRenderer, Partial<TArgs>> {
  if (storyAnnotations === undefined) {
    // eslint-disable-next-line local-rules/no-uncategorized-errors
    throw new Error('Expected a story but received undefined.');
  }

  // @TODO: Support auto title

  componentAnnotations.title = componentAnnotations.title ?? DEFAULT_STORY_TITLE;
  const normalizedComponentAnnotations =
    normalizeComponentAnnotations<TRenderer>(componentAnnotations);

  const storyName =
    exportsName ||
    storyAnnotations.storyName ||
    storyAnnotations.story?.name ||
    storyAnnotations.name ||
    DEFAULT_STORY_NAME;

  const normalizedStory = normalizeStory<TRenderer>(
    storyName,
    storyAnnotations,
    normalizedComponentAnnotations
  );

  const normalizedProjectAnnotations = normalizeProjectAnnotations<TRenderer>(
    composeConfigs([defaultConfig ?? {}, globalProjectAnnotations, projectAnnotations ?? {}])
  );

  const story = prepareStory<TRenderer>(
    normalizedStory,
    normalizedComponentAnnotations,
    normalizedProjectAnnotations
  );

  const globalsFromGlobalTypes = getValuesFromArgTypes(normalizedProjectAnnotations.globalTypes);

  const initializeContext = () => {
    const context: StoryContext<TRenderer> = prepareContext({
      hooks: new HooksContext(),
      globals: {
        // TODO: remove loading from globalTypes in 9.0
        ...globalsFromGlobalTypes,
        ...normalizedProjectAnnotations.initialGlobals,
        ...story.storyGlobals,
      },
      args: { ...story.initialArgs },
      viewMode: 'story',
      loaded: {},
      abortSignal: new AbortController().signal,
      step: (label, play) => story.runStep(label, play, context),
      canvasElement: null!,
      canvas: {} as Canvas,
      globalTypes: normalizedProjectAnnotations.globalTypes,
      ...story,
      context: null!,
      mount: null!,
    });

    context.context = context;

    if (story.renderToCanvas) {
      context.renderToCanvas = async () => {
        // Consolidate this renderContext with Context in SB 9.0
        const unmount = await story.renderToCanvas?.(
          {
            componentId: story.componentId,
            title: story.title,
            id: story.id,
            name: story.name,
            tags: story.tags,
            showMain: () => {},
            showError: (error) => {},
            showException: (error) => {},
            forceRemount: true,
            storyContext: context,
            storyFn: () => story.unboundStoryFn(context),
            unboundStoryFn: story.unboundStoryFn,
          } as RenderContext<TRenderer>,
          context.canvasElement
        );
        if (unmount) {
          cleanups.push(unmount);
        }
      };
    }

    context.mount = story.mount(context);

    return context;
  };

  let loadedContext: StoryContext<TRenderer> | undefined;

  const play = async (extraContext?: Partial<StoryContext<TRenderer, Partial<TArgs>>>) => {
    const context = initializeContext();
    context.canvasElement ??= globalThis?.document?.body;
    if (loadedContext) {
      context.loaded = loadedContext.loaded;
    }
    Object.assign(context, extraContext);
    return story.playFunction!(context);
  };

  const run = (extraContext?: Partial<StoryContext<TRenderer, Partial<TArgs>>>) => {
    const context = initializeContext();
    Object.assign(context, extraContext);
    return runStory(story, context);
  };

  const playFunction = story.playFunction ? play : undefined;

  const composedStory: ComposedStoryFn<TRenderer, Partial<TArgs>> = Object.assign(
    function storyFn(extraArgs?: Partial<TArgs>) {
      const context = initializeContext();
      if (loadedContext) {
        context.loaded = loadedContext.loaded;
      }
      context.args = {
        ...context.initialArgs,
        ...extraArgs,
      };
      return story.unboundStoryFn(context);
    },
    {
      id: story.id,
      storyName,
      load: async () => {
        // First run any registered cleanup function
        for (const callback of [...cleanups].reverse()) await callback();
        cleanups.length = 0;

        const context = initializeContext();

        context.loaded = await story.applyLoaders(context);

        cleanups.push(...(await story.applyBeforeEach(context)).filter(Boolean));

        loadedContext = context;
      },
      args: story.initialArgs as Partial<TArgs>,
      parameters: story.parameters as Parameters,
      argTypes: story.argTypes as StrictArgTypes<TArgs>,
      play: playFunction!,
      run,
      tags: story.tags,
    }
  );

  return composedStory;
}

export function composeStories<TModule extends Store_CSFExports>(
  storiesImport: TModule,
  globalConfig: ProjectAnnotations<Renderer>,
  composeStoryFn: ComposeStoryFn
) {
  const { default: meta, __esModule, __namedExportsOrder, ...stories } = storiesImport;
  const composedStories = Object.entries(stories).reduce((storiesMap, [exportsName, story]) => {
    if (!isExportStory(exportsName, meta)) {
      return storiesMap;
    }

    const result = Object.assign(storiesMap, {
      [exportsName]: composeStoryFn(
        story as LegacyStoryAnnotationsOrFn,
        meta,
        globalConfig,
        exportsName
      ),
    });
    return result;
  }, {});

  return composedStories;
}

type WrappedStoryRef = { __pw_type: 'jsx' | 'importRef' };
type UnwrappedJSXStoryRef = {
  __pw_type: 'jsx';
  type: UnwrappedImportStoryRef;
};
type UnwrappedImportStoryRef = ComposedStoryFn;

declare global {
  function __pwUnwrapObject(
    storyRef: WrappedStoryRef
  ): Promise<UnwrappedJSXStoryRef | UnwrappedImportStoryRef>;
}

export function createPlaywrightTest<TFixture extends { extend: any }>(
  baseTest: TFixture
): TFixture {
  return baseTest.extend({
    mount: async ({ mount, page }: any, use: any) => {
      await use(async (storyRef: WrappedStoryRef, ...restArgs: any) => {
        // Playwright CT deals with JSX import references differently than normal imports
        // and we can currently only handle JSX import references
        if (
          !('__pw_type' in storyRef) ||
          ('__pw_type' in storyRef && storyRef.__pw_type !== 'jsx')
        ) {
          // eslint-disable-next-line local-rules/no-uncategorized-errors
          throw new Error(dedent`
              Portable stories in Playwright CT only work when referencing JSX elements.
              Please use JSX format for your components such as:

              instead of:
              await mount(MyComponent, { props: { foo: 'bar' } })

              do:
              await mount(<MyComponent foo="bar"/>)

              More info: https://storybook.js.org/docs/api/portable-stories-playwright
            `);
        }

        await page.evaluate(async (wrappedStoryRef: WrappedStoryRef) => {
          const unwrappedStoryRef = await globalThis.__pwUnwrapObject?.(wrappedStoryRef);
          const story =
            '__pw_type' in unwrappedStoryRef ? unwrappedStoryRef.type : unwrappedStoryRef;
          return story?.load?.();
        }, storyRef);

        // mount the story
        const mountResult = await mount(storyRef, ...restArgs);

        // play the story in the browser
        await page.evaluate(async (wrappedStoryRef: WrappedStoryRef) => {
          const unwrappedStoryRef = await globalThis.__pwUnwrapObject?.(wrappedStoryRef);
          const story =
            '__pw_type' in unwrappedStoryRef ? unwrappedStoryRef.type : unwrappedStoryRef;
          const canvasElement = document.querySelector('#root');
          return story?.play?.({ canvasElement });
        }, storyRef);

        return mountResult;
      });
    },
  });
}

// TODO At some point this function should live in prepareStory and become the core of StoryRender.render as well.
// Will make a follow up PR for that
async function runStory<TRenderer extends Renderer>(
  story: PreparedStory<TRenderer>,
  context: StoryContext<TRenderer>
) {
  for (const callback of [...cleanups].reverse()) await callback();
  cleanups.length = 0;

  if (!context.canvasElement) {
    const container = document.createElement('div');
    globalThis?.document?.body?.appendChild(container);
    context.canvasElement = container;
    cleanups.push(() => {
      if (globalThis?.document?.body?.contains(container)) {
        globalThis?.document?.body?.removeChild(container);
      }
    });
  }

  context.loaded = await story.applyLoaders(context);
  if (context.abortSignal.aborted) return;

  cleanups.push(...(await story.applyBeforeEach(context)).filter(Boolean));

  const playFunction = story.playFunction;

  const isMountDestructured = story.usesMount;

  if (!isMountDestructured) {
    await context.mount();
  }

  if (context.abortSignal.aborted) return;

  if (playFunction) {
    if (!isMountDestructured) {
      context.mount = async () => {
        throw new MountMustBeDestructuredError({ playFunction: playFunction.toString() });
      };
    }
    await playFunction(context);
  }
}
