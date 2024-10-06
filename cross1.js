const crosswordSolver = (puzzle, words) => {
    if (typeof puzzle !== 'string' || !Array.isArray(words)) {
        console.log('Error')
        return
    }

    // Convert puzzle to grid
    const grid = puzzle.split('\n').map(row => row.split(''));
    const grid1 = grid.map(row => [...row])
    // Create tracking object for word starts
    const wordStartTracker = new Map, wordStartTracker2 = new Map;

    // Initialize tracker from grid
    var wordsCount = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            let isNan = isNaN(grid[i][j]);
            let startWord = parseInt(grid[i][j]);
            if (!isNan && startWord > 0) {
                if (startWord > 2) {
                    console.log("Error")
                    return
                }
                wordsCount += startWord
                wordStartTracker.set([i, j], startWord)
                wordStartTracker2.set([i, j], startWord)
            }
        }
    }

    if (wordsCount != words.length) {
        console.log("Error")
        return
    }

    if (!isValidInput(words)) {
        console.log('Error');
        return;
    }
    const resolved = placeWords(grid, words, wordStartTracker);
    words.reverse()
    const resolved1 = placeWords(grid1, words, wordStartTracker2);
    const result = printPuzzle(grid);
    const result1 = printPuzzle(grid1, '\n');
    console.log(resolved, resolved1)
    console.log(result == result1)
    if (resolved) {
        if (resolved1 && result !== result1) {
            console.log('Error2');
            return
        }
        console.log(printPuzzle(grid));
    } else {
        console.log('Error2');

    }
}

const isValidInput = (words) => {
    // Check for duplicate words
    const wordSet = new Set(words);
    return wordSet.size === words.length
}

const canPlaceHorizontally = (grid, word, key, tracker) => {
    if (key[1] + word.length > grid[0].length) return false;

    const remainingStarts = tracker.get(key) || 0;
    if (remainingStarts === 0) {
        return false;
    }

    for (let i = 0; i < word.length; i++) {
        const cell = grid[key[0]][key[1] + i];
        if (cell === '.') return false;
        if (isNaN(cell) && cell !== word[i]) return false;
    }
    return true;
}

const canPlaceVertically = (grid, word, key, tracker) => {

    // Check if word fits within grid
    if (key[0] + word.length > grid.length) return false;

    // Check if we can start a word here
    const remainingStarts = tracker.get(key) || 0;

    // If this isn't a valid start position or no more words can start here
    if (remainingStarts === 0) {
        return false;
    }

    // Check for conflicts with existing letters and dots
    for (let i = 0; i < word.length; i++) {
        const cell = grid[key[0] + i][key[1]];
        if (cell === '.') return false;
        if (isNaN(cell) && cell !== word[i]) return false;
    }

    return true;
}

const placeByDir = (grid, word, key, tracker, direction) => {
    if (tracker.has(key)) {
        tracker.set(key, tracker.get(key) - 1);
    }
    for (let i = 0; i < word.length; i++) {
        if (direction == "H") {
            grid[key[0]][key[1] + i] = word[i];
        } else {
            grid[key[0] + i][key[1]] = word[i];
        }
    }
}


const saveState = (grid, tracker) => {
    return {
        grid: grid.map(row => [...row]),
        tracker: new Map(tracker)
    };
}

const restoreState = (grid, tracker, state) => {
    // Restore grid
    for (let i = 0; i < grid.length; i++) {
        grid[i] = [...state.grid[i]];
    }

    tracker.forEach((value, key) => {
        tracker.set(key, state.tracker.get(key));
    });
}

const placeWords = (grid, words, tracker, index = 0) => {
    // Base case: all words placed
    if (index === words.length) {
        return true;
    }

    const word = words[index];
    for (let key of tracker.keys()) {
        if (canPlaceHorizontally(grid, word, key, tracker)) {
            const state = saveState(grid, tracker);
            placeByDir(grid, word, key, tracker, "H");
            if (placeWords(grid, words, tracker, index + 1)) {
                return true;
            }
            restoreState(grid, tracker, state);
        }

        // Try vertical placement
        if (canPlaceVertically(grid, word, key, tracker)) {
            const state = saveState(grid, tracker);
            placeByDir(grid, word, key, tracker, "V");
            if (placeWords(grid, words, tracker, index + 1)) {
                return true;
            }
            restoreState(grid, tracker, state);
        }
    }
    return false;
}



const printPuzzle = grid => {
    return grid.map(row => row.join('')).join('\n');
}

let puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
let words = [
    'sun',
    'sunglasses',
    'suncream',
    'swimming',
    'bikini',
    'beach',
    'icecream',
    'tan',
    'deckchair',
    'sand',
    'seaside',
    'sandals',
].reverse()


crosswordSolver(puzzle, words);
console.log("case 2");
puzzle = '2000\n0...\n0...\n0...'
words = ['abba', 'assa']
crosswordSolver(puzzle, words);
console.log("case 3");
puzzle = '0001\n0..0\n3000\n0..0'
words = ['casa', 'alan', 'ciao', 'anta']

// const puzzle = '2001\n0..0\n1000\n0..0'
// const words = ['casa', 'alan', 'ciao', 'anta']

crosswordSolver(puzzle, words); 