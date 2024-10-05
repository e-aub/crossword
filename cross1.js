const crosswordSolver = (puzzle, words) => {
    // Convert puzzle to grid
    const grid = puzzle.split('\n').map(row => row.split(''));

    // Create tracking object for word starts
    const wordStartTracker = {};

    // Initialize tracker from grid
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (!isNaN(grid[i][j]) && parseInt(grid[i][j]) > 0) {
                wordStartTracker[`${i},${j}`] = parseInt(grid[i][j]);
            }
        }
    }

    if (!isValidInput(grid, words, wordStartTracker)) {
        console.log('Error');
        return;
    }

    const solved = placeWords(grid, words, wordStartTracker);

    if (solved) {
        console.log(printPuzzle(grid));
    } else {
        console.log('Error');
    }
}

const isValidInput = (grid, words, tracker) => {
    // Check for duplicate words
    const wordSet = new Set(words);
    if (wordSet.size !== words.length) return false;

    // Check if total required word starts matches number of words
    const totalRequired = Object.values(tracker).reduce((sum, count) => sum + count, 0);
    if (totalRequired !== words.length) return false;

    return true;
}

const canPlaceHorizontally = (grid, word, row, col, tracker) => {
    // Check if word fits within grid
    if (col + word.length > grid[0].length) return false;

    // Check if we can start a word here
    const key = `${row},${col}`;
    const remainingStarts = tracker[key] || 0;

    // If this isn't a valid start position or no more words can start here
    if ((!isNaN(grid[row][col]) && parseInt(grid[row][col]) === 0) || remainingStarts === 0) {
        return false;
    }

    // Check for conflicts with existing letters and dots
    for (let i = 0; i < word.length; i++) {
        const cell = grid[row][col + i];
        if (cell === '.') return false;
        if (isNaN(cell) && cell !== word[i]) return false;
    }

    return true;
}

const canPlaceVertically = (grid, word, row, col, tracker) => {
    // Check if word fits within grid
    if (row + word.length > grid.length) return false;

    // Check if we can start a word here
    const key = `${row},${col}`;
    const remainingStarts = tracker[key] || 0;

    // If this isn't a valid start position or no more words can start here
    if ((!isNaN(grid[row][col]) && parseInt(grid[row][col]) === 0) || remainingStarts === 0) {
        return false;
    }

    // Check for conflicts with existing letters and dots
    for (let i = 0; i < word.length; i++) {
        const cell = grid[row + i][col];
        if (cell === '.') return false;
        if (isNaN(cell) && cell !== word[i]) return false;
    }

    return true;
}

const placeWordHorizontally = (grid, word, row, col, tracker) => {
    // Decrement the word start counter for this position
    const key = `${row},${col}`;
    if (tracker[key]) {
        tracker[key]--;
    }

    // Place the word in the grid
    for (let i = 0; i < word.length; i++) {
        grid[row][col + i] = word[i];
    }
}

const placeWordVertically = (grid, word, row, col, tracker) => {
    // Decrement the word start counter for this position
    const key = `${row},${col}`;
    if (tracker[key]) {
        tracker[key]--;
    }

    // Place the word in the grid
    for (let i = 0; i < word.length; i++) {
        grid[row + i][col] = word[i];
    }
}

const saveState = (grid, tracker) => {
    return {
        grid: grid.map(row => [...row]),
        tracker: { ...tracker }
    };
}

const restoreState = (grid, tracker, state) => {
    // Restore grid
    for (let i = 0; i < grid.length; i++) {
        grid[i] = [...state.grid[i]];
    }

    Object.keys(tracker).forEach(key => {
        tracker[key] = state.tracker[key];
    });
}

const placeWords = (grid, words, tracker, index = 0) => {
    // Base case: all words placed
    if (index === words.length) {
        // Check if all positions have used their required number of starts
        return Object.values(tracker).every(count => count === 0);
    }

    const word = words[index];
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            // Try horizontal placement
            if (canPlaceHorizontally(grid, word, row, col, tracker)) {
                const state = saveState(grid, tracker);
                placeWordHorizontally(grid, word, row, col, tracker);
                if (placeWords(grid, words, tracker, index + 1)) {
                    return true;
                }
                restoreState(grid, tracker, state);
            }

            // Try vertical placement
            if (canPlaceVertically(grid, word, row, col, tracker)) {
                const state = saveState(grid, tracker);
                placeWordVertically(grid, word, row, col, tracker);
                if (placeWords(grid, words, tracker, index + 1)) {
                    return true;
                }
                restoreState(grid, tracker, state);
            }
        }
    }

    return false;
}

const printPuzzle = grid => {
    return grid.map(row => row.join('')).join('\n');
}

const puzzle = '2001\n0..0\n1000\n0..0'
const words = ['casa', 'alan', 'ciao', 'anta']

crosswordSolver(puzzle, words);