import type { FC } from 'react';
import React from 'react';
import { useGlobalTypes } from '@storybook/manager-api';
import { Toolbar } from '@storybook/components/experimental';
import { ToolbarMenuList } from './ToolbarMenuList';
import { normalizeArgType } from '../utils/normalize-toolbar-arg-type';
import type { ToolbarArgType } from '../types';

/**
 * A smart component for handling manager-preview interactions.
 */
export const ToolbarManager: FC = () => {
  const globalTypes = useGlobalTypes();
  const globalIds = Object.keys(globalTypes).filter((id) => !!globalTypes[id].toolbar);

  if (!globalIds.length) {
    return null;
  }

  return (
    <>
      <Toolbar.Separator />
      {globalIds.map((id) => {
        const normalizedArgType = normalizeArgType(id, globalTypes[id] as ToolbarArgType);

        return <ToolbarMenuList key={id} id={id} {...normalizedArgType} />;
      })}
    </>
  );
};
