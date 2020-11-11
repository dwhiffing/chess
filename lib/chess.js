let config = {
  startingGrid: 'RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr',
  // startingGrid: 'R3K2R/PPPPPPPP/8/8/8/8/pppppppp/r3k2r',
  // startingGrid: 'QKBNR3/PPPPP3/8/8/ppppp3/qkbnr3/8/8',
  promotions: true,
  castling: true,
  pawnLeaping: true,
  passant: true,
}

// TODO: Support different board sizes

export const getInitialGrid = () =>
  fenToLocal(config.startingGrid)
    .split('')
    .map((i, index) => ({ value: i !== ' ' ? i : '', index }))

export const getIsBlack = ({ value = '' } = {}) => value === value.toUpperCase()

export const performMove = (grid, a, b) => {
  grid = getMove(grid, a, b)

  if (config.promotions) grid = enforcePromotions(grid)
  if (config.passant) grid = enforcePassant(grid, a, b)
  if (config.castling) grid = enforceCastling(grid, a, b)

  return grid
}

// remove moves that leave king in check
export const getPossibleMoves = (grid, tile, meta) => {
  const legalMoves = getLegalMoves(grid, tile, meta)
  const turnIndex = tile.value === tile.value.toUpperCase() ? 1 : 0

  const possibleMoves = legalMoves.filter((move) => {
    const newGrid = getMove(grid, tile, grid[move])
    return getActiveCheck(newGrid, turnIndex).length === 0
  })

  return possibleMoves
}

export const getActiveCheck = (grid, turnIndex) => {
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
  const possible = possibleAttackers
    .filter((t) => t.moves.some((target) => target.value.toLowerCase() === 'k'))
    .map((t) => ({
      from: t.tile.index,
      to: t.moves
        .filter((t) => t.value.toLowerCase() === 'k')
        .map((t) => t.index),
    }))

  return possible
}

export const getActiveCheckmate = (grid, turnIndex) => {
  if (!grid) return
  if (getActiveCheck(grid, turnIndex).length === 0) return false

  return getSafeMoves(grid, turnIndex).length === 0
}

export const getIsInStaleMate = (grid, turnIndex) => {
  if (!grid) return
  if (getActiveCheck(grid, turnIndex).length > 0) return false

  return getSafeMoves(grid, turnIndex).length === 0
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
  const random = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
  const move = random ? random.move : null

  return move ? [move.from, move.to] : null
}

export const getPassantIndex = (a, b) => {
  if (a.value.toLowerCase() === 'p' && Math.abs(a.index - b.index) > 8) {
    return a.index + (a.value === a.value.toLowerCase() ? -8 : 8)
  } else {
    return null
  }
}

export const getCastleStatus = (currentStatus = '', a) => {
  if (a.value === 'k') {
    return currentStatus.replace(/kq/, '')
  } else if (a.value === 'K') {
    return currentStatus.replace(/KQ/, '')
  } else if (a.value === 'R') {
    if (a.index === 0) return currentStatus.replace(/Q/, '')
    if (a.index === 7) return currentStatus.replace(/K/, '')
  } else if (a.value === 'r') {
    if (a.index === 56) return currentStatus.replace(/q/, '')
    if (a.index === 63) return currentStatus.replace(/k/, '')
  }
  return currentStatus
}

const getLegalMoves = (grid, tile, meta = {}) => {
  const { passantIndex, castleStatus } = meta

  let result = []
  if (tile.value.toLowerCase() === 'p') {
    result = getPawnMoves(grid, tile, passantIndex)
  }
  if (tile.value.toLowerCase() === 'k') {
    result = getKingMoves(grid, tile, castleStatus)
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

const getSafeMoves = (grid, turnIndex) =>
  grid
    .filter(
      (t) =>
        t.value !== '' && (turnIndex === 1 ? getIsBlack(t) : !getIsBlack(t)),
    )
    .map((t) => getLegalMoves(grid, t).map((i) => ({ from: t, to: grid[i] })))
    .flat()
    .filter((move) => {
      const newGrid = getMove(grid, move.from, move.to)
      const stillInCheck = getActiveCheck(newGrid, turnIndex).length > 0
      return !stillInCheck
    })

const getOrthagonalMoves = (grid, tile) => {
  let moves = []
  let x = tile.index % 8

  moves = moves.concat(getDirectionalMoves(grid, tile, 8))
  moves = moves.concat(getDirectionalMoves(grid, tile, -8))

  if (x !== 7) moves = moves.concat(getDirectionalMoves(grid, tile, 1))
  if (x !== 0) moves = moves.concat(getDirectionalMoves(grid, tile, -1))

  return moves
}

const getDiagonalMoves = (grid, tile) => {
  let moves = []
  let x = tile.index % 8

  if (x !== 7) moves = moves.concat(getDirectionalMoves(grid, tile, -7))
  if (x !== 7) moves = moves.concat(getDirectionalMoves(grid, tile, 9))
  if (x !== 0) moves = moves.concat(getDirectionalMoves(grid, tile, -9))
  if (x !== 0) moves = moves.concat(getDirectionalMoves(grid, tile, 7))

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

const getKingMoves = (grid, sourceTile, castleStatus = '') => {
  const i = sourceTile.index
  const isBlack = getIsBlack(sourceTile)
  let moves = []
  let x = sourceTile.index % 8
  moves = moves.concat([i + 8, i - 8])
  if (x !== 0) {
    moves = moves.concat([i + 7, i - 1, i - 9])
  }
  if (x !== 7) {
    moves = moves.concat([i - 7, i + 1, i + 9])
  }

  if (config.castling) {
    const noPiecesOnLeft = isBlack
      ? !grid[1].value && !grid[2].value && !grid[3].value
      : !grid[57].value && !grid[58].value && !grid[59].value
    const noPiecesOnRight = isBlack
      ? !grid[5].value && !grid[6].value
      : !grid[61].value && !grid[62].value
    const canCastleLeft = castleStatus.match(isBlack ? /Q/ : /q/)
    const canCastleRight = castleStatus.match(isBlack ? /K/ : /k/)
    // TODO: need to check if castling would put us in check
    const wouldPutUsInCheck = false

    if (!wouldPutUsInCheck) {
      if (noPiecesOnLeft && canCastleLeft) moves = moves.concat([i - 2])
      if (noPiecesOnRight && canCastleRight) moves = moves.concat([i + 2])
    }
  }

  return moves
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

const getPawnMoves = (grid, tile, passantIndex) => {
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
    if (
      config.pawnLeaping &&
      tile.index >= startCoords[0] &&
      tile.index <= startCoords[1]
    ) {
      const forwardTwo = grid.find(
        ({ index, value }) => index === tile.index + 16 * multi && !value,
      )
      if (forwardTwo) moves.push(forwardTwo.index)
    }
  }

  const topLeftIndex = tile.index + 9 * multi
  const topRightIndex = tile.index + 7 * multi
  const tileLeft = grid.find(
    ({ index, value }) =>
      index === topLeftIndex &&
      value &&
      value === (isBlack ? value.toLowerCase() : value.toUpperCase()),
  )
  const tileRight = grid.find(
    ({ index, value }) =>
      index === tile.index + 7 * multi &&
      value &&
      value === (isBlack ? value.toLowerCase() : value.toUpperCase()),
  )

  if (tileLeft && (isBlack ? x <= 6 : x >= 1)) moves.push(topLeftIndex)
  if (tileRight && (isBlack ? x >= 1 : x <= 6)) moves.push(topRightIndex)

  if (config.passant) {
    if (topLeftIndex === passantIndex) moves.push(topLeftIndex)
    if (topRightIndex === passantIndex) moves.push(topRightIndex)
  }

  return moves
}

// TODO: need to allow selection of promotion type
const enforcePromotions = (grid) => {
  return grid.map((tile) => {
    if ((tile.index < 8 || tile.index > 55) && tile.value.toLowerCase() === 'p')
      tile.value = tile.value === tile.value.toLowerCase() ? 'q' : 'Q'

    return tile
  })
}

const enforcePassant = (grid, a, b) => {
  if (
    a.value &&
    a.value.toLowerCase() === 'p' &&
    a.index % 8 !== b.index % 8 &&
    b.value === ''
  ) {
    return grid.map((tile) => {
      if (tile.index === b.index + (getIsBlack(a) ? -8 : 8)) {
        return { index: tile.index, value: '' }
      }
      return tile
    })
  }
  return grid
}

const enforceCastling = (grid, a, b) => {
  if (a.value && a.value.toLowerCase() === 'k') {
    if (a.index - 2 === b.index) {
      const leftRook = getIsBlack(a) ? grid[0] : grid[56]
      return getMove(grid, leftRook, { index: a.index - 1, value: '' })
    }
    if (a.index + 2 === b.index) {
      const rightRook = getIsBlack(a) ? grid[7] : grid[63]
      return getMove(grid, rightRook, { index: a.index + 1, value: '' })
    }
  }

  return grid
}

const getMove = (grid, a, b) =>
  grid.map(({ index: i, value: v }) => {
    let value = i === b.index ? a.value : i === a.index ? '' : v
    return { index: i, value }
  })

const fenToLocal = (fen) =>
  fen.replace(/\//g, '').replace(/\d/g, (m) => ' '.repeat(m))

export default getPossibleMoves
