<script>
  export let children = undefined;
</script>

<div style="border: 3px solid red; padding: 10px;">
  <h3>The content below is the default slot:</h3>
  <slot />
  <h3>The content below is the <code>children</code> prop:</h3>
  {children}
</div>
