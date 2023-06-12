<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  onMount(() => {
    setTimeout(() => {
      dispatch("dismiss");
    }, 1000);
  });
</script>

<div role="alert" out:fade={{ duration: 100 }}>
  <slot />
</div>

<style>
  div {
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.5rem auto;
    background-color: #333;
    font-size: 1.25rem;
    font-weight: bold;
    user-select: none;
  }
</style>
