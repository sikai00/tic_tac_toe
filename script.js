// Player factory method
const playerFactory = (playerName, playerSym) => {
  const _name = playerName;
  const _sym = playerSym;

  const getName = () => _name;

  const getSym = () => _sym;

  const toString = () => `${_name}, ${_sym}`;

  return {
    getName,
    getSym,
    toString
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
      _board[row][col] = player.getSym();
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
  let winner = null;
  let gameEnded = false;
  const _playerOne = playerFactory('Player 1', 'X');
  const _playerTwo = playerFactory('Player 2', 'O');
  let _currentTurn = _playerOne;

  /**
   * Resets the gameboard to an initial state.
   */
  const resetGameboard = () => {
    gameBoard.clearBoard();
    winner = null;
    gameEnded = false;
    _currentTurn = _playerOne;
  };

  /**
   * Returns the player whose turn is current.
   * @returns Player whose turn is current.
   */
  const getCurrentTurn = () => _currentTurn;

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

      if (currRow.every(x => x === _playerOne.getSym()) || currRow.every(x => x === _playerTwo.getSym())) {
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

      if (currCol.every(x => x === _playerOne.getSym()) || currCol.every(x => x === _playerTwo.getSym())) {
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

    if (leftDiagonal.every(x => x === _playerOne.getSym()) || 
        rightDiagonal.every(x => x === _playerOne.getSym()) ||
        leftDiagonal.every(x => x === _playerTwo.getSym()) || 
        rightDiagonal.every(x => x === _playerOne.getSym())) {
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
    if (_checkWin()) {
      return false;
    }
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
  const _checkEndGame = () => {
    if (_checkWin() || _checkTie()) {
      gameEnded = true;
      return true
    }
    return false;
  };

  /**
   * Return the winning player if the game has ended.
   * @return The winning player if there is one else null.
   */
  const getWinner = () => {
    if (_checkEndGame() && !_checkTie()) {
      return _currentTurn;
    } else {
      return null;
    }
  }

  /**
   * Toggles between players for the current turn.
   */
  const _toggleTurn = () => {
    _currentTurn = _currentTurn == _playerOne ? _playerTwo : _playerOne;
  }

  /**
   * Check if the game has ended due to a win or tie.
   * @return Whether the game has ended or not.
   */
  const checkGameEnded = () => gameEnded;

   /**
    * Main logic of the game. Represents each step. 
    * Updates current player's turn, sets the correct cell to the correct 
    * input. Blocks any next step if a forbidden cell is used as input. 
    * Checks for wins at each stage. Called upon input to a cell.
    */
  const nextStep = (e, row, col) => {
    if (gameEnded || winner) {
      return false;
    }
    if (gameBoard.getCell(row, col) != '') {
      return false;
    }
    gameBoard.setCell(_currentTurn, row, col);

    if (winner == null &&_checkEndGame()) {
      winner = getWinner();
      return true;
    }

    _toggleTurn();
    return true;
  }

  return {
    resetGameboard,
    getCurrentTurn,
    getWinner,
    checkGameEnded,
    nextStep
  };
})();

// Display logic
const displayController = (() => {
  const updateCellDisplay = cell => {
    row = cell.dataset.row;
    col = cell.dataset.col;
    cell.textContent = gameBoard.getCell(row, col);
  };

  const turnDisplayNode = document.querySelector('.turn');
  const winnerMessageNode = document.querySelector('.winner');
  const cellNodelist = document.querySelectorAll('.cell');
  cellNodelist.forEach(cell => {
    cell.addEventListener('click', e => {
      gameController.nextStep(e, cell.dataset.row, cell.dataset.col);
      updateCellDisplay(e.target);
      turnDisplayNode.textContent = `Turn: ${gameController.getCurrentTurn().toString()}`;
      if (gameController.checkGameEnded()) {
        turnDisplayNode.style.display = 'none';
        winnerMessageNode.style.display = 'block';
        if (gameController.getWinner() != null) {
          winnerMessageNode.textContent = `Winner: ${gameController.getWinner()}`;
        } else {
          winnerMessageNode.textContent = "Tie";
        }
      }
    });
  });

  const resetButtonNode = document.querySelector('.reset');
  resetButtonNode.addEventListener('click', () => {
    gameController.resetGameboard();
    cellNodelist.forEach(cell => updateCellDisplay(cell));
    turnDisplayNode.textContent = `Turn: ${gameController.getCurrentTurn().toString()}`;
    turnDisplayNode.style.display = 'block';
    winnerMessageNode.style.display = 'none';
  });

})();