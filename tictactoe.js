// 'use strict';

const gameBoardInitData = [
  Array(3).fill(null),
  Array(3).fill(null),
  Array(3).fill(null),
];

const GAME_STATUS = Object.freeze({
  PLAYING: "Playing",
  WIN: "Win",
  TIE: "Tie",
});

const GameBlock = function ({
  gameBoard,
  isGameFinished,
  setGameBoard,
  saveGameHistory,
  currentPlayer,
  setCurrentPlayer,
  setIsGameFinished,
}) {
  return gameBoard.map((row, i) => (
    <div key={i}>
      {row.map((block, x) => (
        <p
          key={x}
          onClick={() => {
            if (isGameFinished || gameBoard[i][x]) return;

            const updatedGameBoard = gameBoard.slice();
            updatedGameBoard[i][x] = currentPlayer;
            setGameBoard(updatedGameBoard);
            saveGameHistory(updatedGameBoard);
            let gameStatus = checkWin(currentPlayer, updatedGameBoard);
            console.log("gameStatus", gameStatus);
            if (gameStatus === GAME_STATUS.PLAYING) {
              setCurrentPlayer((prev) => (prev === "O" ? "X" : "O"));
            } else setIsGameFinished(true);
          }}
        >
          {block}
        </p>
      ))}
    </div>
  ));
};

const History = function ({
  isGameFinished,
  showGameReplay,
  gameHistory,
  moveToSelectedState,
}) {
  return (
    <section className="historyContainer">
      <h5>History</h5>
      {isGameFinished && <button onClick={showGameReplay}>Replay</button>}

      <ul>
        {gameHistory.length > 0 ? (
          gameHistory.map((history, i) => (
            <li key={i} onClick={() => moveToSelectedState(i)}>
              History {i}
            </li>
          ))
        ) : (
          <p> No history yet</p>
        )}
      </ul>
    </section>
  );
};

function App() {
  const [gameBoard, setGameBoard] = React.useState(gameBoardInitData);
  const [gameHistory, setGameHistory] = React.useState([]);
  const [currentPlayer, setCurrentPlayer] = React.useState("O");
  const [isGameFinished, setIsGameFinished] = React.useState(false);
  console.log("render...");

  function restartGame() {
    const defaultGameBoard = gameBoard.map(() => Array(3).fill(null));
    setGameBoard(defaultGameBoard);
    setIsGameFinished(false);
    setGameHistory([]);
  }

  function saveGameHistory(latestGameHistory) {
    const cloneGameBoard = latestGameHistory.map((board) => {
      return board.map((block) => {
        return [block];
      });
    });
    setGameHistory([...gameHistory, cloneGameBoard]);
  }

  function moveToSelectedState(index) {
    setGameBoard([...gameHistory[index]]);
    setIsGameFinished(false);
  }

  function showGameReplay() {
    let index = 1;
    moveToSelectedState(0);
    const replayInterval = setInterval(() => {
      if (index >= gameHistory.length) {
        clearInterval(replayInterval);
        setIsGameFinished(true);
      } else {
        console.log("index: ", index);
        moveToSelectedState(index);
        index++;
      }
    }, 1500);
  }

  return (
    <div className="container">
      <h3>Current Player {currentPlayer}</h3>
      {isGameFinished && <h3>Game Won By: {currentPlayer}</h3>}
      <GameBlock
        gameBoard={gameBoard}
        isGameFinished={isGameFinished}
        setGameBoard={setGameBoard}
        saveGameHistory={saveGameHistory}
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
        setIsGameFinished={setIsGameFinished}
      />
      <button onClick={restartGame}>Restart</button>
      <History
        isGameFinished={isGameFinished}
        showGameReplay={showGameReplay}
        gameHistory={gameHistory}
        moveToSelectedState={moveToSelectedState}
      />
    </div>
  );
}

const possibleWins = [
  // horizontal win
  { row: [0, 0, 0], block: [0, 1, 2] },
  { row: [1, 1, 1], block: [0, 1, 2] },
  { row: [2, 2, 2], block: [0, 1, 2] },

  // vertical win
  { row: [0, 1, 2], block: [0, 0, 0] },
  { row: [0, 1, 2], block: [1, 1, 1] },
  { row: [0, 1, 2], block: [2, 2, 2] },

  // diagonal win
  { row: [0, 1, 2], block: [0, 1, 2] },
  { row: [2, 1, 0], block: [0, 1, 2] },
];
function checkWin(currentPlayer, gameBoard) {
  for (let item in possibleWins) {
    const row = possibleWins[item].row;
    const block = possibleWins[item].block;
    console.log("item:", item, row, block);
    if (
      gameBoard[row[0]][block[0]] === currentPlayer &&
      gameBoard[row[1]][block[1]] === currentPlayer &&
      gameBoard[row[2]][block[2]] === currentPlayer
    ) {
      return GAME_STATUS.WIN;
    }
  }
  return GAME_STATUS.PLAYING;
  if (
    (gameBoard[0][0] === currentPlayer &&
      gameBoard[0][1] === currentPlayer &&
      gameBoard[0][2] === currentPlayer) ||
    (gameBoard[1][0] === currentPlayer &&
      gameBoard[1][1] === currentPlayer &&
      gameBoard[1][2] === currentPlayer) ||
    (gameBoard[2][0] === currentPlayer &&
      gameBoard[2][1] === currentPlayer &&
      gameBoard[2][2] === currentPlayer)
  ) {
    return GAME_STATUS.WIN;
  }
  if (
    (gameBoard[0][0] === currentPlayer &&
      gameBoard[1][0] === currentPlayer &&
      gameBoard[2][0] === currentPlayer) ||
    (gameBoard[0][1] === currentPlayer &&
      gameBoard[1][1] === currentPlayer &&
      gameBoard[2][1] === currentPlayer) ||
    (gameBoard[0][2] === currentPlayer &&
      gameBoard[1][2] === currentPlayer &&
      gameBoard[2][2] === currentPlayer)
  ) {
    return GAME_STATUS.WIN;
  }
  if (
    (gameBoard[0][0] === currentPlayer &&
      gameBoard[1][1] === currentPlayer &&
      gameBoard[2][2] === currentPlayer) ||
    (gameBoard[2][0] === currentPlayer &&
      gameBoard[1][1] === currentPlayer &&
      gameBoard[0][2] === currentPlayer)
  ) {
    return GAME_STATUS.WIN;
  }

  return GAME_STATUS.PLAYING;
}
