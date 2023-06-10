<script lang="ts">
  import Keyboard from "./lib/Keyboard.svelte";
</script>

<main>
  <h1>wordle.px</h1>
  <Keyboard />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: var(--game-width);
    width: 100%;
    margin: 0 auto;
    font-family: sans-serif;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
</style>
