//index.js
let boardSize = 10; // 기본 10x10 보드
let cellSize; // 셀의 크기는 동적으로 계산될 것입니다.
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasSize = canvas.width; // 캔버스 크기 설정
const speedControl = document.getElementById('speedControl');
let speed = 500; // 기본 속도
let generationCount = 0; // 세대 카운터 초기화
let recentGenerations = [];
let isOscillating = false;

function createEmptyBoard(size) {
    return Array.from({ length: size }, () => Array(size).fill(0));
}

function createRandomBoard(size) {
    const board = [];
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = Math.floor(Math.random() * 2);
        }
    }
    return board;
}

let currentBoard = createRandomBoard(boardSize); // 현재 게임 보드 상태
let gameRunning = false;
let gameInterval;

// 캔버스에 보드를 그리는 함수
function drawBoard(board) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the cells
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            ctx.fillStyle = board[i][j] ? '#4caf50' : '#ffffff';
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
}

// 셀의 크기를 계산하는 함수
function calculateCellSize() {
    cellSize = canvasSize / boardSize;
}

document.addEventListener('DOMContentLoaded', () => {
    updateGenerationDisplay();
    calculateCellSize();
    drawBoard(createEmptyBoard(boardSize)); // 캔버스에 빈 게임 보드를 그립니다.

    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        if (startButton.textContent === 'Start Game') {
            startGame();
            startButton.textContent = 'Pause';
        } else if (startButton.textContent === 'Pause') {
            pauseGame();
            startButton.textContent = 'Resume';
        } else if (startButton.textContent === 'Resume') {
            if (!gameRunning) {
                startGame(); // 게임을 재개합니다.
                startButton.textContent = 'Pause';
            }
        } else if (startButton.textContent === 'Restart') {
            restartGame();
            startButton.textContent = 'Start Game';
        }
    });

    // 보드 크기 적용 버튼 이벤트 리스너
    document.getElementById('applyBoardSize').addEventListener('click', applyNewBoardSize);
});

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasLeft = (event.clientX - rect.left) * scaleX;
    const canvasTop = (event.clientY - rect.top) * scaleY;

    const x = Math.floor(canvasLeft / cellSize);
    const y = Math.floor(canvasTop / cellSize);

    currentBoard[y][x] = currentBoard[y][x] ? 0 : 1; // Toggle the cell state
    drawBoard(currentBoard); // Redraw the board
});

function applyNewBoardSize() {
    const newSize = parseInt(document.getElementById('boardSizeInput').value);
    if (newSize >= 1 && newSize <= 1000) {
        boardSize = newSize;
        calculateCellSize();
        currentBoard = createEmptyBoard(boardSize);
        drawBoard(currentBoard);
    } else {
        alert('Board size must be between 1 and 1000.');
    }
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        runGame();
        document.getElementById('statusDisplay').textContent = 'Game Started!';
    }
}

function pauseGame() {
    if (gameRunning) {
        clearInterval(gameInterval);
        gameRunning = false;
        document.getElementById('statusDisplay').textContent = 'Game Paused!';
    }
}

speedControl.addEventListener('input', function() {
    speed = this.value;
    if (gameRunning) {
        clearInterval(gameInterval);
        runGame();
    }
});

function updateGenerationDisplay() {
    const generationDisplay = document.getElementById('generationDisplay');
    generationDisplay.textContent = `Generation: ${generationCount}`;
}

function countAliveCells(board) {
    return board.flat().reduce((acc, cell) => acc + cell, 0);
}

function updateStatistics() {
    const aliveCellsCount = countAliveCells(currentBoard);
    document.getElementById('aliveCellsCount').textContent = `${aliveCellsCount}`;
}


function runGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    gameRunning = true;
    gameInterval = setInterval(() => {
        if (isBoardStaticOrOscillating(currentBoard)) {
            if (isOscillating) {
                document.getElementById('statusDisplay').textContent = 'Game Over!';
                document.getElementById('startButton').textContent = 'Restart';
                clearInterval(gameInterval); // 게임 인터벌 중단
                gameRunning = false;
            } else {
                clearInterval(gameInterval);
                gameRunning = false;
                document.getElementById('statusDisplay').textContent = 'Game Over!';
                document.getElementById('startButton').textContent = 'Restart';
            }
            return; // 게임 오버 상태에서는 더 이상의 세대 카운팅을 중단합니다.
        }

        // 게임 오버가 아닌 경우에만 세대 카운트 증가
        generationCount++;
        updateGenerationDisplay();
        currentBoard = calculateNextGeneration(currentBoard);
        drawBoard(currentBoard);
        updateStatistics(); // 살아있는 셀의 수 업데이트
    }, 1000 - speed);
}


function restartGame() {
    clearInterval(gameInterval);
    generationCount = 0; // 세대 카운터 리셋
    updateGenerationDisplay(); // 세대 카운터 업데이트
    currentBoard = createRandomBoard(boardSize);
    drawBoard(currentBoard);
    document.getElementById('statusDisplay').textContent = 'Game Restarted!';
    gameRunning = false;
}

function isBoardStaticOrOscillating(currentBoard) {
    const currentBoardString = boardToString(currentBoard);
    if (recentGenerations.includes(currentBoardString)) {
        // 현재 보드가 이전에 존재했던 보드와 동일하면 진동자 상태로 간주
        isOscillating = true;
        return true; // 게임 오버 상태를 표시하지만, 게임은 계속 진행
    } else {
        // 현재 보드가 최근 세대들과 다르면 배열에 추가
        recentGenerations.push(currentBoardString);
        // 배열이 너무 길어지지 않도록 최대 크기를 제한
        if (recentGenerations.length > 10) { // 10은 임의로 정한 숫자로, 진동자의 최대 주기를 고려해서 조정 가능
            recentGenerations.shift();
        }
        isOscillating = false;
    }
    // 이전 세대와 동일한지 검사하는 대신 최근 세대들의 패턴만을 확인
    return false;
}

function placePattern(patternName) {
    const pattern = patterns[patternName];
    const offsetRow = Math.floor((boardSize - pattern.length) / 2);
    const offsetCol = Math.floor((boardSize - pattern[0].length) / 2);

    for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[i].length; j++) {
            currentBoard[offsetRow + i][offsetCol + j] = pattern[i][j];
        }
    }

    drawBoard(currentBoard);
}

function clearBoard() {
    currentBoard = createEmptyBoard(boardSize);
    generationCount = 0;
    updateGenerationDisplay();
    drawBoard(currentBoard);
}

document.getElementById('placePatternButton').addEventListener('click', () => {
    const selectedPattern = document.getElementById('patternSelector').value;
    if (gameRunning) {
        pauseGame();
    }
    clearBoard();
    placePattern(selectedPattern);
    // 게임을 재시작하려면 startGame()을 호출할 수 있습니다.
});

document.getElementById('savePatternButton').addEventListener('click', () => {
    const currentPattern = boardToString(currentBoard);
    localStorage.setItem('savedPattern', currentPattern);
    alert('Pattern saved!');
});

document.getElementById('loadPatternButton').addEventListener('click', () => {
    const savedPattern = localStorage.getItem('savedPattern');
    if (savedPattern) {
        currentBoard = stringToBoard(savedPattern);
        drawBoard(currentBoard);
        if (gameRunning) {
            clearInterval(gameInterval);
        }
        gameRunning = false; // 게임 상태 업데이트
        document.getElementById('startButton').textContent = 'Start Game'; // 버튼 텍스트 변경
        recentGenerations = []; // 여기에 recentGenerations 초기화 추가
    } else {
        alert('No saved pattern found!');
    }
});


function boardToString(board) {
    return board.map(row => row.join('')).join('\n');
}

function stringToBoard(str) {
    const rows = str.split('\n');
    const patternBoard = rows.map(row => row.split('').map(cell => parseInt(cell)));

    // 저장된 패턴과 현재 보드 크기 비교
    const patternRows = patternBoard.length;
    const patternCols = patternBoard[0].length;
    const startRow = Math.floor((boardSize - patternRows) / 2);
    const startCol = Math.floor((boardSize - patternCols) / 2);

    // 새로운 빈 보드 생성
    const newBoard = createEmptyBoard(boardSize);

    // 패턴을 새 보드에 적용
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            // 패턴의 해당 부분이 존재하는 경우에만 적용
            const patternRow = i - startRow;
            const patternCol = j - startCol;
            if (patternRow >= 0 && patternRow < patternRows &&
                patternCol >= 0 && patternCol < patternCols) {
                newBoard[i][j] = patternBoard[patternRow][patternCol];
            }
        }
    }

    return newBoard;
}




// 여기에 calculateNextGeneration 및 관련 게임 로직 함수를 추가합니다.
