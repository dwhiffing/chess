// TODO: castling
// TODO: en passant
// TODO: pawn promotion

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

const getLegalMoves = (grid, tile) => {
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

export const getPossibleMoves = (grid, tile) => {
  const legalMoves = getLegalMoves(grid, tile)
  const turnIndex = tile.value === tile.value.toUpperCase() ? 1 : 0

  const possibleMoves = legalMoves.filter((move) => {
    const newGrid = getMove(grid, tile, grid[move])
    return !getIsInCheck(newGrid, turnIndex)
  })

  return possibleMoves
}

export const getIsInCheck = (grid, turnIndex) => {
  if (!grid) return
  const enemyUnits = grid.filter(
    (t) => t.value !== '' && (turnIndex === 0 ? getIsBlack(t) : !getIsBlack(t)),
  )
  const possibleAttackers = enemyUnits
    .map((t) => ({
      tile: t,
      moves: getLegalMoves(grid, t)
        .map((i) => grid[i])
        .filter((t) => t && t.value),
    }))
    .filter((t) => t.moves.length > 0)
  return possibleAttackers.some((t) =>
    t.moves.some((target) => target.value.toLowerCase() === 'k'),
  )
}

export const getIsInCheckMate = (grid, turnIndex) => {
  if (!grid) return
  if (!getIsInCheck(grid, turnIndex)) return false

  const playerUnits = grid.filter(
    (t) => t.value !== '' && (turnIndex === 1 ? getIsBlack(t) : !getIsBlack(t)),
  )

  const possiblePlayerMoves = playerUnits
    .map((t) => getLegalMoves(grid, t).map((i) => ({ from: t, to: grid[i] })))
    .flat()

  const safeMoves = possiblePlayerMoves.filter((move) => {
    const newGrid = getMove(grid, move.from, move.to)
    const stillInCheck = getIsInCheck(newGrid, turnIndex)
    return !stillInCheck
  })

  return safeMoves.length === 0
}

export const getIsInStaleMate = (grid, turnIndex) => {
  if (!grid) return
  if (getIsInCheck(grid, turnIndex)) return false

  const playerUnits = grid.filter(
    (t) => t.value !== '' && (turnIndex === 1 ? getIsBlack(t) : !getIsBlack(t)),
  )

  const possiblePlayerMoves = playerUnits
    .map((t) => getLegalMoves(grid, t).map((i) => ({ from: t, to: grid[i] })))
    .flat()
  return possiblePlayerMoves.length === 0
}

const getOrthagonalMoves = (grid, tile) => {
  let moves = []
  const isBlack = getIsBlack(tile)
  let x = tile.index % 8

  moves = moves.concat(getDirectionalMoves(grid, tile, 8))
  moves = moves.concat(getDirectionalMoves(grid, tile, -8))

  if (isBlack ? x !== 0 : x !== 7)
    moves = moves.concat(getDirectionalMoves(grid, tile, 1))
  if (isBlack ? x !== 7 : x !== 0)
    moves = moves.concat(getDirectionalMoves(grid, tile, -1))

  return moves
}

const getDiagonalMoves = (grid, tile) => {
  let moves = []
  const isBlack = getIsBlack(tile)
  let x = tile.index % 8

  if (isBlack ? x !== 0 : x !== 7)
    moves = moves.concat(getDirectionalMoves(grid, tile, -7))
  if (isBlack ? x !== 0 : x !== 7)
    moves = moves.concat(getDirectionalMoves(grid, tile, 9))
  if (isBlack ? x !== 7 : x !== 0)
    moves = moves.concat(getDirectionalMoves(grid, tile, -9))
  if (isBlack ? x !== 7 : x !== 0)
    moves = moves.concat(getDirectionalMoves(grid, tile, 7))

  return moves
}

const getDirectionalMoves = (grid, tile, directionIndex) => {
  let moves = []
  let index = tile.index + directionIndex
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
    index += directionIndex
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
  let x = tile.index % 8
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

  if (tileLeft && (isBlack ? x <= 6 : x >= 1))
    moves.push(tile.index + 9 * multi)
  if (tileRight && (isBlack ? x >= 1 : x <= 6))
    moves.push(tile.index + 7 * multi)

  return moves
}

export const getAIMove = (grid) => {
  const playerUnits = grid.filter((t) => t.value !== '' && getIsBlack(t))

  const possiblePlayerMoves = playerUnits
    .map((t) =>
      getPossibleMoves(grid, t).map((i) => ({ from: t, to: grid[i] })),
    )
    .flat()

  const scores = possiblePlayerMoves.map((move) => {
    const newGrid = getMove(grid, move.from, move.to)
    const units = newGrid.filter((t) => t.value !== '' && !getIsBlack(t))
    const possibleMoves = units
      .map((t) =>
        getPossibleMoves(grid, t).map((i) => ({ from: t, to: grid[i] })),
      )
      .flat()

    return { move, score: possibleMoves.length }
  })

  const sortedMoves = scores.sort((a, b) => a.score - b.score)
  const possibleMoves = sortedMoves.filter(
    (m) => m.score === sortedMoves[0].score,
  )
  const move =
    possibleMoves[Math.floor(Math.random() * possibleMoves.length)].move

  return getMove(grid, move.from, move.to)
}

export default getPossibleMoves
