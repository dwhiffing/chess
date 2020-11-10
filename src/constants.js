export const INITIAL_GRID = 'RNBQKBNRPPPPPPPP                                pppppppprnbqkbnr'
  .split('')
  .map((i, index) => ({
    value: i !== ' ' ? i : '',
    index,
  }))
