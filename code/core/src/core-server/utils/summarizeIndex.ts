import { isExampleStoryId } from '@storybook/core/telemetry';
import type { IndexEntry, StoryIndex } from '@storybook/core/types';

import { AUTODOCS_TAG, PLAY_FN_TAG, isMdxEntry } from './StoryIndexGenerator';

const PAGE_REGEX = /(page|screen)/i;

export const isPageStory = (storyId: string) => PAGE_REGEX.test(storyId);

/**
 * Is this story generated by the CLI
 */
const isCLIExampleEntry = (entry: IndexEntry) =>
  [
    'example-introduction--docs',
    'configure-your-project--docs',
    'example-button--docs',
    'example-button--primary',
    'example-button--secondary',
    'example-button--large',
    'example-button--small',
    'example-header--docs',
    'example-header--logged-in',
    'example-header--logged-out',
    'example-page--logged-in',
    'example-page--logged-out',
  ].includes(entry.id);

export function summarizeIndex(storyIndex: StoryIndex) {
  let storyCount = 0;
  const componentTitles = new Set<string>();
  let exampleStoryCount = 0;
  let onboardingStoryCount = 0;
  let onboardingDocsCount = 0;
  let exampleDocsCount = 0;
  let pageStoryCount = 0;
  let playStoryCount = 0;
  let autodocsCount = 0;
  let mdxCount = 0;
  Object.values(storyIndex.entries).forEach((entry) => {
    if (isCLIExampleEntry(entry)) {
      if (entry.type === 'story') exampleStoryCount += 1;
      if (entry.type === 'docs') exampleDocsCount += 1;
    } else if (isExampleStoryId(entry.id)) {
      if (entry.type === 'story') onboardingStoryCount += 1;
      if (entry.type === 'docs') onboardingDocsCount += 1;
    } else if (entry.type === 'story') {
      storyCount += 1;
      componentTitles.add(entry.title);
      if (isPageStory(entry.title)) {
        pageStoryCount += 1;
      }
      if (entry.tags?.includes(PLAY_FN_TAG)) {
        playStoryCount += 1;
      }
    } else if (entry.type === 'docs') {
      if (isMdxEntry(entry)) {
        mdxCount += 1;
      } else if (entry.tags?.includes(AUTODOCS_TAG)) {
        autodocsCount += 1;
      }
    }
  });
  const componentCount = componentTitles.size;
  return {
    storyCount,
    componentCount,
    pageStoryCount,
    playStoryCount,
    autodocsCount,
    mdxCount,
    exampleStoryCount,
    exampleDocsCount,
    onboardingStoryCount,
    onboardingDocsCount,
    version: storyIndex.v,
  };
}
