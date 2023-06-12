<script lang="ts">
  import { onMount } from "svelte";
  import { LetterState } from "../constants";
  import { allWords } from "../words";

  const answer = "miray";

  const board = Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({
      letter: "",
      state: LetterState.INITIAL,
    }))
  );

  const icons = {
    [LetterState.CORRECT]: "🟩",
    [LetterState.PRESENT]: "🟨",
    [LetterState.ABSENT]: "⬜",
    [LetterState.INITIAL]: null,
  };

  const letterStates = {};

  let currentRowIndex = 0;
  let message = "";
  let grid = "";
  let shakeRowIndex = -1;
  let success = false;
  let allowInput = true;

  $: currentRow = board[currentRowIndex];

  const onKeyup = (e: KeyboardEvent) => onKey(e.key);

  function onKey(key: string) {
    if (!allowInput) return;

    if (/^[a-zA-ZĞğÜüŞşİıÖöÇç]$/.test(key)) {
      fillTile(key.toLowerCase());
    } else if (key === "Backspace") {
      clearTile();
    } else if (key === "Enter") {
      completeRow();
    }
  }

  function fillTile(letter: string) {
    for (const tile of currentRow) {
      if (!tile.letter) {
        tile.letter = letter;
        break;
      }
    }

    board[currentRowIndex] = [...currentRow];
  }

  function clearTile() {
    for (const tile of [...currentRow].reverse()) {
      if (tile.letter) {
        tile.letter = "";
        break;
      }
    }

    board[currentRowIndex] = [...currentRow];
  }

  function completeRow() {
    if (currentRow.every((tile) => tile.letter)) {
      const guess = currentRow.map((tile) => tile.letter).join("");
      if (!allWords.includes(guess) && guess !== answer) {
        shake();
        showMessage(`Kelime listesinde yok`);
        return;
      }

      const answerLetters: (string | null)[] = answer.split("");

      console.log(answerLetters);
      // first pass: mark correct ones
      currentRow.forEach((tile, i) => {
        if (answerLetters[i] === tile.letter) {
          tile.state = letterStates[tile.letter] = LetterState.CORRECT;
          answerLetters[i] = null;
        }
      });
      // second pass: mark the present
      currentRow.forEach((tile) => {
        if (!tile.state && answerLetters.includes(tile.letter)) {
          tile.state = LetterState.PRESENT;
          answerLetters[answerLetters.indexOf(tile.letter)] = null;
          if (!letterStates[tile.letter]) {
            letterStates[tile.letter] = LetterState.PRESENT;
          }
        }
      });
      // 3rd pass: mark absent
      currentRow.forEach((tile) => {
        if (!tile.state) {
          tile.state = LetterState.ABSENT;
          if (!letterStates[tile.letter]) {
            letterStates[tile.letter] = LetterState.ABSENT;
          }
        }
      });

      allowInput = false;
      if (currentRow.every((tile) => tile.state === LetterState.CORRECT)) {
        // yay!
        setTimeout(() => {
          grid = genResultGrid();
          showMessage(
            [
              "Genius",
              "Magnificent",
              "Impressive",
              "Splendid",
              "Great",
              "Phew",
            ][currentRowIndex],
            -1
          );
          success = true;
        }, 1600);
      } else if (currentRowIndex < board.length - 1) {
        // go the next row
        currentRowIndex++;
        setTimeout(() => {
          allowInput = true;
        }, 1600);
      } else {
        // game over :(
        setTimeout(() => {
          showMessage(answer.toUpperCase(), -1);
        }, 1600);
      }
    } else {
      shake();
      showMessage("Not enough letters");
    }
  }

  function showMessage(msg: string, time = 1000) {
    message = msg;
    if (time > 0) {
      setTimeout(() => {
        message = "";
      }, time);
    }
  }

  function shake() {
    shakeRowIndex = currentRowIndex;
    setTimeout(() => {
      shakeRowIndex = -1;
    }, 1000);
  }

  function genResultGrid() {
    return board
      .slice(0, currentRowIndex + 1)
      .map((row) => {
        return row.map((tile) => icons[tile.state]).join("");
      })
      .join("\n");
  }

  onMount(() => {
    window.addEventListener("keyup", onKeyup);
    return () => {
      window.removeEventListener("keyup", onKeyup);
    };
  });
</script>

<div id="board">
  {#each board as row, index}
    <div class="row" class:shake={shakeRowIndex === index}>
      {#each row as tile}
        <div
          class="tile"
          class:empty={tile.letter.length === 0}
          class:filled={tile.letter}
        >
          {tile.letter}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  #board {
    --height: min(420px, calc(var(--vh, 100vh) - 310px));
    height: var(--height);
    width: min(350px, calc(var(--height) / 6 * 5));
    margin: 0 auto;
    display: grid;
    grid-template-rows: repeat(6, 1fr);
    grid-gap: 5px;
    padding: 10px;
    box-sizing: border-box;
  }

  .row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 5px;
  }

  .tile {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    line-height: 2rem;
    width: 100%;
    font-weight: bold;
    vertical-align: middle;
    box-sizing: border-box;
    color: var(--tile-text-color);
    text-transform: uppercase;
    user-select: none;
  }

  .tile.empty {
    border: 2px solid var(--color-tone-4);
  }

  .tile.filled {
    border: 2px solid var(--color-tone-2);
    animation: zoom 0.1s ease-in-out;
  }

  .shake {
    animation: shake 0.5s;
  }

  @keyframes zoom {
    0% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes shake {
    0% {
      transform: translate(1px);
    }
    10% {
      transform: translate(-2px);
    }
    20% {
      transform: translate(2px);
    }
    30% {
      transform: translate(-2px);
    }
    40% {
      transform: translate(2px);
    }
    50% {
      transform: translate(-2px);
    }
    60% {
      transform: translate(2px);
    }
    70% {
      transform: translate(-2px);
    }
    80% {
      transform: translate(2px);
    }
    90% {
      transform: translate(-2px);
    }
    100% {
      transform: translate(1px);
    }
  }
</style>
