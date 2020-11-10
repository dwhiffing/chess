export const getMove = (grid, a, b) =>
  grid.map(({ index: i, value: v }) => ({
    index: i,
    value: i === b.index ? a.value : i === a.index ? '' : v,
  }))

export const getIsBlack = ({ value = '' } = {}) => value === value.toUpperCase()

export const getInitialGrid = () =>
  'RNBQKBNRPPPPPPPP                                pppppppprnbqkbnr'
    .split('')
    .map((i, index) => ({
      value: i !== ' ' ? i : '',
      index,
    }))

export const getPossibleMoves = (grid, tile) => {
  let result = []
  if (tile.value.toLowerCase() === 'p') {
    result = getPawnMoves(grid, tile)
  }
  if (tile.value.toLowerCase() === 'k') {
    result = getAdjacentMoves(grid, tile)
  }
  if (tile.value.toLowerCase() === 'r') {
    result = getOrthagonalMoves(grid, tile)
  }
  if (tile.value.toLowerCase() === 'b') {
    result = getDiagonalMoves(grid, tile)
  }
  if (tile.value.toLowerCase() === 'q') {
    result = [
      ...getOrthagonalMoves(grid, tile),
      ...getDiagonalMoves(grid, tile),
    ]
  }
  if (tile.value.toLowerCase() === 'n') {
    result = getKnightMoves(grid, tile)
  }

  return result.filter((i) => {
    if (!grid[i]) return false
    if (grid[i].value === '') return true
    return getIsBlack(tile) ? !getIsBlack(grid[i]) : getIsBlack(grid[i])
  })
}

export const getIsInCheck = (grid, turnIndex) => {
  const enemyUnits = grid.filter(
    (t) => t.value !== '' && (turnIndex === 0 ? getIsBlack(t) : !getIsBlack(t)),
  )
  const possibleAttackers = enemyUnits
    .map((t) => ({
      tile: t,
      moves: getPossibleMoves(grid, t)
        .map((i) => grid[i])
        .filter((t) => t && t.value),
    }))
    .filter((t) => t.moves.length > 0)
  return possibleAttackers.some((t) =>
    t.moves.some((target) => target.value.toLowerCase() === 'k'),
  )
}

export const getIsInCheckMate = (grid, turnIndex) => {
  if (!getIsInCheck(grid, turnIndex)) return false

  const playerUnits = grid.filter(
    (t) => t.value !== '' && (turnIndex === 1 ? getIsBlack(t) : !getIsBlack(t)),
  )

  const possiblePlayerMoves = playerUnits
    .map((t) =>
      getPossibleMoves(grid, t).map((i) => ({ from: t, to: grid[i] })),
    )
    .flat()

  const safeMoves = possiblePlayerMoves.filter((move) => {
    const newGrid = getMove(grid, move.from, move.to)
    const stillInCheck = getIsInCheck(newGrid, turnIndex)
    return !stillInCheck
  })

  return safeMoves.length === 0
}

export const getIsInStaleMate = (grid, turnIndex) => {
  if (getIsInCheck(grid, turnIndex)) return false

  const playerUnits = grid.filter(
    (t) => t.value !== '' && (turnIndex === 1 ? getIsBlack(t) : !getIsBlack(t)),
  )

  const possiblePlayerMoves = playerUnits
    .map((t) =>
      getPossibleMoves(grid, t).map((i) => ({ from: t, to: grid[i] })),
    )
    .flat()
  return possiblePlayerMoves.length === 0
}

const getOrthagonalMoves = (grid, tile) => [
  ...getMoves(grid, tile, -8),
  ...getMoves(grid, tile, 8),
  ...getMoves(grid, tile, -1),
  ...getMoves(grid, tile, 1),
]

const getDiagonalMoves = (grid, tile) => [
  ...getMoves(grid, tile, -7),
  ...getMoves(grid, tile, -9),
  ...getMoves(grid, tile, 7),
  ...getMoves(grid, tile, 9),
]

const getLineMoves = (grid, sourceTile, directionIndex) => {
  let moves = []
  let index = sourceTile.index + directionIndex
  let isContiguous = true
  while (index >= 0 && index <= 63 && isContiguous) {
    const tile = grid.find((t) => t.index === index && t.value)
    if (tile) return [...moves, tile.index]

    moves.push(index)
    isContiguous = Math.abs((index % 8) - ((index + directionIndex) % 8)) <= 1
    index += directionIndex
  }
  return moves
}

const getMoves = (grid, tile, n) => {
  let moves = []
  let index = tile.index + n
  const isBlack = getIsBlack(tile)
  let x = index % 8
  while (index >= 0 && index <= 63 && Math.abs(x - (index % 8)) <= 1) {
    const _tile = grid.find((t) => t.index === index)
    if (_tile && _tile.value) {
      if (
        isBlack
          ? _tile.value === _tile.value.toLowerCase()
          : _tile.value === _tile.value.toUpperCase()
      )
        moves.push(_tile.index)
      return moves
    }
    x = index % 8
    moves.push(index)
    index += n
  }
  return moves
}

const getAdjacentMoves = (grid, sourceTile) => {
  const i = sourceTile.index
  return [i + 7, i + 8, i + 9, i - 7, i - 8, i - 9, i - 1, i + 1]
}

const getKnightMoves = (grid, tile) => {
  let x = tile.index % 8
  return [
    x <= 6 && tile.index - 15,
    x <= 5 && tile.index - 6,
    x <= 6 && tile.index + 17,
    x <= 5 && tile.index + 10,
    x >= 1 && tile.index - 17,
    x >= 2 && tile.index - 10,
    x >= 1 && tile.index + 15,
    x >= 2 && tile.index + 6,
  ]
}

const getPawnMoves = (grid, tile) => {
  let moves = []
  const isBlack = getIsBlack(tile)
  let multi = isBlack ? 1 : -1
  let startCoords = isBlack ? [8, 15] : [48, 55]

  const forwardOne = grid.find(
    ({ index, value }) => index === tile.index + 8 * multi && !value,
  )
  if (forwardOne) {
    moves.push(forwardOne.index)
    if (tile.index >= startCoords[0] && tile.index <= startCoords[1]) {
      const forwardTwo = grid.find(
        ({ index, value }) => index === tile.index + 16 * multi && !value,
      )
      if (forwardTwo) moves.push(forwardTwo.index)
    }
  }

  const tileLeft = grid.find(
    ({ index, value }) =>
      index === tile.index + 9 * multi &&
      value &&
      value === (isBlack ? value.toLowerCase() : value.toUpperCase()),
  )
  const tileRight = grid.find(
    ({ index, value }) =>
      index === tile.index + 7 * multi &&
      value &&
      value === (isBlack ? value.toLowerCase() : value.toUpperCase()),
  )
  if (tileLeft) moves.push(tile.index + 9 * multi)
  if (tileRight) moves.push(tile.index + 7 * multi)

  return moves
}

export default {}