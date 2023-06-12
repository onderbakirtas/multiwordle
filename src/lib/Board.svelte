<script lang="ts">
  import { onMount } from "svelte";
  import { LetterState } from "../constants";
  import { addToast } from "../store";
  import { allWords } from "../words";

  const answer = "miray";

  const board = Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => ({
      letter: "",
      state: null,
    }))
  );

  const icons = {
    [LetterState.CORRECT]: "🟩",
    [LetterState.PRESENT]: "🟨",
    [LetterState.ABSENT]: "⬜",
    [LetterState.INITIAL]: null,
  };

  let letterStates = {};

  let currentRowIndex = 0;
  let grid = "";
  let shakeRowIndex = -1;
  let success = false;
  let allowInput = true;

  $: currentRow = board[currentRowIndex];

  const onKeyup = (e: KeyboardEvent) => onKey(e.key);

  function onKey(key: string) {
    if (!allowInput) return;

    if (/^[a-zA-ZĞğÜüŞşİıÖöÇç]$/.test(key)) {
      fillTile(key.toLocaleLowerCase("tr-TR"));
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
        addToast({ message: "Kelime listesinde yok" });
        return;
      }

      const answerLetters: (string | null)[] = answer.split("");

      // first pass: mark correct ones
      currentRow.forEach((tile, i) => {
        if (answerLetters[i] === tile.letter) {
          tile.state = LetterState.CORRECT;
          letterStates[tile.letter] = LetterState.CORRECT;

          answerLetters[i] = null;
        }
      });

      console.log(currentRow);

      // second pass: mark the present
      currentRow.forEach((tile) => {
        console.log(tile.state);
        if (!tile.state && answerLetters.includes(tile.letter)) {
          console.log(tile);
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

      board[currentRowIndex] = [...currentRow];

      allowInput = false;
      if (currentRow.every((tile) => tile.state === LetterState.CORRECT)) {
        // yay!
        setTimeout(() => {
          grid = genResultGrid();
          // showMessage(
          //   [
          //     "Genius",
          //     "Magnificent",
          //     "Impressive",
          //     "Splendid",
          //     "Great",
          //     "Phew",
          //   ][currentRowIndex],
          //   -1
          // );
          success = true;
        }, 1600);
      } else if (currentRowIndex < board.length - 1) {
        console.log("next row");

        // go the next row
        currentRowIndex++;
        setTimeout(() => {
          allowInput = true;
        }, 1600);
      } else {
        // game over :(
        setTimeout(() => {}, 1600);
      }
    } else {
      shake();
      addToast({ message: "Yetersiz harf" });
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
    <div
      class="row"
      class:shake={shakeRowIndex === index}
      class:jump={success && currentRowIndex === index}
    >
      {#each row as tile, j}
        <div
          class="tile"
          class:empty={tile.letter.length === 0}
          class:filled={tile.letter}
          class:revealed={tile.state}
        >
          <div class="front" style:transition-delay="{j * 300}ms">
            {tile.letter}
          </div>
          <div
            class="back"
            class:present={tile.state === LetterState.PRESENT}
            class:correct={tile.state === LetterState.CORRECT}
            class:absent={tile.state === LetterState.ABSENT}
            style:transition-delay="{j * 300}ms"
            style:animation-delay="{j * 100}ms"
          >
            {tile.letter}
          </div>
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
    width: 100%;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: bold;
    vertical-align: middle;
    text-transform: uppercase;
    user-select: none;
    position: relative;
    color: var(--color-tone-1);
  }

  .correct {
    background-color: var(--green);
  }

  .present {
    background-color: var(--yellow);
  }

  .absent {
    background-color: var(--gray);
  }

  .tile.filled {
    /* border: 2px solid var(--color-tone-2); */
    animation: zoom 0.1s ease-in-out;
  }

  .tile .front,
  .tile .back {
    box-sizing: border-box;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .tile .front {
    border: 2px solid #d3d6da;
  }
  .tile.filled .front {
    border-color: #999;
  }
  .tile .back {
    transform: rotateX(180deg);
    color: white;
  }
  .tile.revealed .front {
    transform: rotateX(180deg);
  }
  .tile.revealed .back {
    transform: rotateX(0deg);
  }

  .shake {
    animation: shake 0.5s;
  }

  .jump .tile .back {
    animation: jump 0.5s;
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

  @keyframes jump {
    0% {
      transform: translateY(0px);
    }
    20% {
      transform: translateY(5px);
    }
    60% {
      transform: translateY(-25px);
    }
    90% {
      transform: translateY(3px);
    }
    100% {
      transform: translateY(0px);
    }
  }
</style>
