import React from 'react'
import { Tile } from './Tile'
import { getPossibleMoves } from '../../lib/chess'

export function ChessRoom({
  alternate,
  grid,
  turnIndex,
  lastMoveIndex,
  activeCheckmate,
  activeCheck,
  inStaleMate,
  selectedTile,
  handleClickTile,
  passantIndex,
  castleStatus,
  showMessages,
}) {
  if (!grid) return null

  return (
    <>
      {showMessages && (inStaleMate || activeCheckmate) && (
        <div className="message">
          {inStaleMate && 'Stalemate!'}
          {activeCheckmate &&
            `Checkmate! ${turnIndex === 0 ? 'Black' : 'White'} Wins`}
        </div>
      )}
      <div className="grid">
        {grid.map((tile) => {
          const isMarked =
            selectedTile &&
            getPossibleMoves(grid, selectedTile, {
              passantIndex,
              castleStatus,
            }).includes(tile.index)
          const isTurn =
            turnIndex === 1
              ? tile.value && tile.value === tile.value.toUpperCase()
              : tile.value && tile.value === tile.value.toLowerCase()

          return (
            <Tile
              key={tile.index}
              alternate={alternate}
              selectedTile={selectedTile}
              lastMoveIndex={lastMoveIndex}
              passantIndex={passantIndex}
              tile={{ ...tile, isTurn, isMarked, activeCheck }}
              onClick={handleClickTile}
            />
          )
        })}
      </div>
    </>
  )
}
