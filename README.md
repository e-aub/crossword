# Crossword Solver

## Introduction
The `crosswordSolver` function solves an empty crossword puzzle by filling in the provided words. The puzzle is passed as a string with numbers indicating word placements and dots representing empty spaces.

## Functionality
The function:
- Takes an empty puzzle as a string and a list of words as input.
- Fills in the crossword grid with the words according to the rules.
- Ensures no word duplication.
- Returns an error if the solution is not unique or other rules are violated.

## Usage

### Input
1. **Puzzle (String)**: 
   - Numbers indicate word placements.
   - Dots represent unused spaces.
   - Each row is separated by a newline (`\n`).

2. **Words (Array)**: 
   - A list of words to fill in the puzzle.

### Example

```js
const emptyPuzzle = `2001
0..0
1000
0..0`;
const words = ['casa', 'alan', 'ciao', 'anta'];

crosswordSolver(emptyPuzzle, words);

### Output

casa
i..l
anta
o..n
