const playerText = document.querySelector('.player-turn');
const tiles = document.querySelectorAll(".tile");
const resetButton = document.querySelector("#reset-button");

class Gameboard {
    constructor() {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    placePick(rowNum, colNum, symbol) {
        if (this.board[rowNum][colNum] !== null) {
            return false;
        } else {
            this.board[rowNum][colNum] = symbol;
            return true;
        }
    }

    resetBoard() {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                this.board[row][col] = null;
            }
        }
    }

    checkWinner(symbol) {
        // Check rows
        for (let row of this.board) {
            if (row.every(cell => cell === symbol)) return true;
        }

        // Check columns
        for (let col = 0; col < this.board.length; col++) {
            if (this.board.every(row => row[col] === symbol)) {
                return true;
            }
        }

        // Check diagonals
        if (this.board.every((row, idx) => row[idx] === symbol)) return true;
        if (this.board.every((row, idx) => row[this.board.length - 1 - idx] === symbol)) return true;

        return false;
    }

    isTie() {
        return this.board.every(row => row.every(cell => cell !== null));
    }
}

class Gamecontroller {
    constructor() {
        this.currentPlayer = "X";
        this.gameOver = false;
        this.gameboard = new Gameboard();
    }

    playTurn(rowNum, colNum) {
        if (this.gameOver) {
            alert("Game over! Click reset to start a new game.");
            return ;
        }

        if (!this.gameboard.placePick(rowNum, colNum, this.currentPlayer)) {
            alert("This position has already been taken");
            return ;
        }

        // Update the UI
        const index = rowNum * 3 + colNum;
        tiles[index].textContent = this.currentPlayer;

        // Check for winner
        if (this.gameboard.checkWinner(this.currentPlayer)) {
            playerText.innerText = `${this.currentPlayer} wins!`;
            this.gameOver = true;

        }

        // Check for tie
        if (this.gameboard.isTie()) {
            playerText.innerText = "It's a tie!";
            this.gameOver = true;

        }

        // Switch player
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
        playerText.innerText = `It is ${this.currentPlayer}'s turn`;

    }

    resetGame() {
        this.gameboard.resetBoard();
        this.currentPlayer = "X";
        this.gameOver = false;

        tiles.forEach(tile => {
            tile.textContent = ""; // Clear the tiles
        });

        playerText.innerText = "It is X's turn";
    }

}

class Displaycontainer {
    constructor(gameController) {
        this.gameController = gameController;
    }

    init() {
        tiles.forEach(tile => {
            tile.addEventListener("click", (event) => {
                const index = tile.dataset.index;
                const row = Math.floor(index / 3);
                const col = index % 3;

                this.gameController.playTurn(row, col);
            });
        });

        resetButton.addEventListener("click", () => {
            this.gameController.resetGame();
        });
    }
}

// Initialize game
const gameController = new Gamecontroller();
const display = new Displaycontainer(gameController);
display.init();
