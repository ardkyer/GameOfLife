//gameLogic.js
function calculateNextGeneration(board) {
    const nextBoard = board.map(arr => [...arr]);
    const size = board.length;

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const aliveNeighbors = getAliveNeighbors(board, x, y);

            if (board[x][y] === 1) {
                if (aliveNeighbors < 2 || aliveNeighbors > 3) {
                    nextBoard[x][y] = 0;
                }
            } else {
                if (aliveNeighbors === 3) {
                    nextBoard[x][y] = 1;
                }
            }
        }
    }
    return nextBoard;
}

function runGame() {
    // 가정: 게임 보드는 2차원 배열로 표현되며, 각 셀은 살아있으면 1, 죽어있으면 0입니다.
    let currentBoard = createRandomBoard(boardSize); // 랜덤한 초기 보드 생성

    // 각 세대를 계산하고 콘솔에 로깅하는 함수
    const updateAndRender = () => {
        currentBoard = calculateNextGeneration(currentBoard);
        renderBoard(currentBoard);
    };

    // 일정 간격으로 게임 상태를 업데이트합니다.
    setInterval(updateAndRender, 1000); // 매 1초마다 세대를 업데이트합니다.
}

// 게임 보드를 렌더링하는 함수
function renderBoard(board) {
    const cells = document.querySelectorAll('.cell');
    board.flat().forEach((cellState, index) => {
        cells[index].classList.toggle('alive', cellState === 1);
    });
}


function getAliveNeighbors(board, x, y) {
    const size = board.length;
    let count = 0;

    // 주변 8개의 셀을 확인합니다.
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // 자기 자신은 제외합니다.

            // 토러스 형태의 보드를 위해 모듈러 연산을 사용합니다.
            const newX = (x + i + size) % size;
            const newY = (y + j + size) % size;

            count += board[newX][newY];
        }
    }
    return count;
}

function createRandomBoard(size) {
    const board = [];
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = Math.random() < 0.5 ? 1 : 0;
        }
    }
    return board;
}

function logGenerations(startBoard, generations) {
    let board = startBoard;
    for (let i = 0; i < generations; i++) {
        console.log(`Generation ${i}:`);
        console.log(board.map(row => row.join(' ')).join('\n'));
        board = calculateNextGeneration(board);
    }
}

function generateDataset(size, generations, samples) {
    const dataset = [];
    for (let i = 0; i < samples; i++) {
        const startBoard = createRandomBoard(size);
        const endBoard = runGenerations(startBoard, generations);
        dataset.push({ startBoard, endBoard });
    }
    return dataset;
}

function flattenBoard(board) {
    return board.flat();
}
