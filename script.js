// Player factory method
const playerFactory = (playerName, playerSym) => {
  const _name = playerName;
  const _sym = playerSym;

  const getName = () => _name;

  const getSym = () => _sym;

  return {
    getName,
    getSym
  }
};

// Game board
const gameBoard = (() => {
  const _board = [
    ['','',''],
    ['','',''],
    ['','','']
  ];

  // test out using function instead
  const clearBoard = () => {
    for (row in _board) {
      for (col in _board) {
        _board[row][col] = '';
      }
    }
  }

  function clearBoard2() {
    for (row in _board) {
      for (col in _board) {
        _board[row][col] = '';
      }
    }
  }

  const getCell = (row, col) => {
    return _board[row][col];
  }

  const setCell = (player, row, col) => {
    if (_board[row][col] === '') {
      _board[row][col] = player.getSym()
    }
  };

  return {
    clearBoard,
    clearBoard2,
    getCell,
    setCell
  }
})();

// Game logic
const gameController = (() => {
  let gameEnded = false;
  const _playerOne = playerFactory('Player 1', 'X');
  const _playerTwo = playerFactory('Player 2', 'O');
  let _currentTurn = _playerOne;

  /**
   * Returns the player whose turn is current.
   * @returns Player whose turn is current.
   */
  const getCurrentTurn = () => _currentTurn;

  /**
   * Wait for input from the current turn's player, then update the cell. Updates
   * the currentTurn as well.
   */
  const getPlayerInput = (row, col) => {
    gameBoard.setCell(_currentTurn, row, col);
  }

  /**
   * Checks for winning rows on the gameboard.
   * @return True if there is a winning row else false.
   */
  const _checkRows = () => {
    for (let row = 0; row < 3; row++) {
      let currRow = [];
      for (let col = 0; col < 3; col++) {
        currRow.push(gameBoard.getCell(row, col));
      }

      if (currRow.every(x => _playerOne.getSym()) || currRow.every(x => _playerTwo.getSym())) {
        return true;
      }
    }
    return false;
  };

  /**
   * Checks for winning columns on the gameboard.
   * @return True if there is a winning column else false.
   */
  const _checkCols = () => {
    for (let col = 0; col < 3; col++) {
      let currCol = [];
      for (let row = 0; row < 3; row++) {
        currCol.push(gameBoard.getCell(row, col));
      }

      if (currCol.every(x => _playerOne.getSym()) || currRow.every(x => _playerTwo.getSym())) {
        return true;
      }
    }
    return false;
  };

  /**
   * Checks for winning diagonals on the gameboard.
   * @return True if there is a winning diagonal else false.
   */
  const _checkDiags = () => {
    leftDiagonal = [gameBoard.getCell(0,0), gameBoard.getCell(1,1), gameBoard.getCell(2,2)];
    rightDiagonal = [gameBoard.getCell(2,0), gameBoard.getCell(1,1), gameBoard.getCell(0,2)];

    if (leftDiagonal.every(x => _playerOne.getSym()) || 
        rightDiagonal.every(x => _playerOne.getSym()) ||
        leftDiagonal.every(x => _playerTwo.getSym()) || 
        rightDiagonal.every(x => _playerOne.getSym())) {
      return true;
    }
    return false;
  };

  /**
   * Checks for wins on the gameboard.
   * @return True if there is a winner else false.
   */
  const _checkWin = () => {
    return _checkRows() || _checkCols() || _checkDiags()
  };

  /**
   * Checks for ties on the gameboard.
   * @return True if there is a tie else false.
   */
  const _checkTie = () => {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (gameBoard.getCell(row, col) == '') {
          return false;
        }
      }
    }
    return true;
  };

  /**
   * Checks if the game has ended.
   * @return True if the game has ended else false.
   */
  const checkEndGame = () => {
    if (_checkWin() || _checkTie()) {
      return true
    }
    return false;
  };

  /**
   * Return the winning player if the game has ended.
   * @return The winning player if there is one else null.
   */
   const getWinner = () => {
    if (!gameEnded && !_checkTie()) {
      return _currentTurn == _playerOne ? _playerTwo : _playerOne;
    } else {
      return null;
    }
   }

  return {
    getCurrentTurn,
    getPlayerInput,
    checkEndGame,
    gameEnded
  };
})();

// Display logic
const displayController = (() => {

})();