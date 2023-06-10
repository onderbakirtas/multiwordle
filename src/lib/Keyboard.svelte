<script lang="ts">
  import IconBackspace from "./IconBackspace.svelte";

  const keys = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "ğ", "ü"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i"],
    ["Enter", "z", "x", "c", "v", "b", "n", "m", "ö", "ç", "Backspace"],
  ];
</script>

<div id="keyboard">
  {#each keys as row, i}
    <div class="row">
      {#if i === 1}
        <div class="spacer" />
      {/if}
      {#each row as key}
        {#if key === "Enter"}
          <button type="button" class="big">{key}</button>
        {:else if key === "Backspace"}
          <button type="button" class="big">
            <IconBackspace />
          </button>
        {:else}
          <button type="button">{key}</button>
        {/if}
      {/each}
      {#if i === 1}
        <div class="spacer" />
      {/if}
    </div>
  {/each}
</div>

<style>
  #keyboard {
    margin: 30px 8px 0;
    user-select: none;
  }
  .row {
    display: flex;
    width: 100%;
    margin: 0 auto 8px;
    touch-action: manipulation;
  }

  .spacer {
    flex: 0.5;
  }

  button {
    --key-bg: var(--color-tone-4);
    --key-text-color: var(--color-tone-1);

    text-transform: uppercase;
    font-family: inherit;
    font-weight: bold;
    border: 0;
    padding: 0;
    margin: 0 6px 0 0;
    height: 58px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    background-color: var(--key-bg);
    color: var(--key-text-color);
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
  }

  button:last-of-type {
    margin: 0;
  }

  button.big {
    flex: 1.5;
  }
</style>
