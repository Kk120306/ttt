const playerText = document.querySelector('.player-turn');

const Gameboard = (function () {
    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]    
    ];

    function placePick(rowNum, colNum, symbol) {
        if (board[rowNum][colNum] !== null) {
            return false;
        } else {
            board[rowNum][colNum] = symbol;
        }
        return true;
    }

    function getBoard() {
        return board;
    }

    function resetBoard() {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                board[row][col] = null;
            }
        }
    }

    function checkWinner(symbol) {

        for (let row of board) {
            if (row.every(cell => cell === symbol)) return true;
        }


        for (let col = 0; col < board.length; col++) {
            if (board.every(row => row[col] === symbol)) {
                return true;
            }
        }


        if (board.every((row, idx) => row[idx] === symbol)) {
            return true;
        }


        if (board.every((row, idx) => row[board.length - 1 - idx] === symbol)) {
            return true;
        }

        return false;
    }

    function isTie() {
        return board.every(row => row.every(cell => cell !== null));
    }

    return { placePick, getBoard, resetBoard, checkWinner, isTie };
})();

// Gamecontroller module
const Gamecontroller = (function() {
    let currentPlayer = "X";
    let gameOver = false;
    

    function playTurn(rowNum, colNum) {
        if (gameOver) {
            alert("Game over! Click reset to start a new game.");
            return false;
        }

        if (Gameboard.placePick(rowNum, colNum, currentPlayer) === false) {
            alert("This position has already been taken");
            return false;
        }

        const index = rowNum * 3 + colNum;
        tiles[index].textContent = currentPlayer;


        if (Gameboard.checkWinner(currentPlayer)) {
            playerText.innerText =`${currentPlayer} wins!`
            gameOver = true;
            return true;
        }

        
        if (Gameboard.isTie()) {
            playerText.innerText = "It's a tie!";
            gameOver = true; 
            return true;
        }

        
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        playerText.innerText = `It is ${currentPlayer}'s turn`;
        return true;
    }

    function resetGame() {
        Gameboard.resetBoard();
        currentPlayer = "X";
        gameOver = false; 
        
        const tiles = document.querySelectorAll(".tile");
        tiles.forEach(tile => {
            tile.textContent = ""; 
        });
    }

    function getCurrentPlayerSymbol() {
        return currentPlayer;
    }

    function getGameOver() {
        return gameOver; 
    }

    return { playTurn, resetGame, getCurrentPlayerSymbol, getGameOver };
})();


const Displaycontainer = (function () {
    const init = (tiles) => {
        tiles.forEach(tile => {
            tile.addEventListener("click", () => {
                const index = tile.dataset.index;
                const row = Math.floor(index / 3);
                const col = index % 3;

                if (Gamecontroller.playTurn(row, col)) {
                    if (Gamecontroller.getGameOver()) {
                        tiles.forEach(t => t.removeEventListener("click", () => {})); 
                    }
                }
            });
        });
    };

    const resetBoard = (tiles) => {
        tiles.forEach(tile => (tile.textContent = ""));
    };

    return { init, resetBoard };
})();


const tiles = document.querySelectorAll(".tile");
Displaycontainer.init(tiles);


const resetButton = document.querySelector("#reset-button");
resetButton.addEventListener("click", () => {
    Gamecontroller.resetGame();
    Displaycontainer.resetBoard(tiles);
    playerText.innerText = "It is X's turn";
});
