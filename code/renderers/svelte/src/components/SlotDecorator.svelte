<script>
  import { onMount } from 'svelte';
  import { VERSION as SVELTE_VERSION } from 'svelte/compiler';

  export let decorator = undefined;
  export let Component;
  export let props = {};
  export let on = undefined;
  export let argTypes = undefined;
  export let isOriginalStory = false;

  let instance;
  let decoratorInstance;

  const IS_SVELTE_V4 = Number(SVELTE_VERSION[0]) <= 4;

  const CHILDREN_ARG_AS_DEFAULT_SLOT =
    globalThis.FRAMEWORK_OPTIONS?.childrenArgAsDefaultSlot ?? false;
  /*
    Svelte Docgen will create argTypes for events with the name 'event_eventName'
    The Actions addon will convert these to args because they are type: 'action'
    We need to filter these args out so they are not passed to the component
    We also need to filter out the 'children' prop because we render it as the default slot instead
  */
  let filteredProps;
  $: filteredProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => {
      if (key.startsWith('event_')) {
        return false;
      }
      if (key === 'children' && CHILDREN_ARG_AS_DEFAULT_SLOT) {
        return false;
      }
      return true;
    })
  );

  if (isOriginalStory && argTypes && IS_SVELTE_V4) {
    const eventsFromArgTypes = Object.fromEntries(
      Object.entries(argTypes)
        .filter(([key, value]) => value.action && props[key] != null)
        .map(([key, value]) => [value.action, props[key]])
    );
    // Attach Svelte event listeners in Svelte v4
    // In Svelte v5 this is not possible anymore as instances are no longer classes with $on() properties, so it will be a no-op
    onMount(() => {
      Object.entries({ ...eventsFromArgTypes, ...on }).forEach(([eventName, eventCallback]) => {
        // instance can be undefined if a decorator doesn't have a <slot/>
        const inst = instance ?? decoratorInstance;
        inst?.$on?.(eventName, eventCallback);
      });
    });
  }
</script>

{#if decorator}
  <svelte:component this={decorator.Component} {...decorator.props} bind:this={decoratorInstance}>
    {#if CHILDREN_ARG_AS_DEFAULT_SLOT && isOriginalStory && props.children}
      <svelte:component this={Component} {...filteredProps} bind:this={instance}>
        {#if props.children.Component}
          <svelte:component this={props.children.Component} {...props.children.props} />
        {:else}
          {@html props.children}
        {/if}
      </svelte:component>
    {:else}
      <svelte:component this={Component} {...filteredProps} bind:this={instance} />
    {/if}
  </svelte:component>
{:else if CHILDREN_ARG_AS_DEFAULT_SLOT && isOriginalStory && props.children}
  <svelte:component this={Component} {...filteredProps} bind:this={instance}>
    {#if props.children.Component}
      <svelte:component this={props.children.Component} {...props.children.props} />
    {:else}
      {@html props.children}
    {/if}
  </svelte:component>
{:else}
  <svelte:component this={Component} {...filteredProps} bind:this={instance} />
{/if}
