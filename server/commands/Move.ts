import { Command } from "@colyseus/command"
import * as chess from './../../lib/chess'
import { RoomState, Tile } from "../schema"
import { ArraySchema } from '@colyseus/schema'

export class MoveCommand extends Command<RoomState, { from: any, to: any }> {
  validate({ from, to }) {
    const isBlack = chess.getIsBlack(from)
    if ((isBlack && this.state.turnIndex === 0) || (!isBlack && this.state.turnIndex === 1)) return false
    return chess.getPossibleMoves(
      this.state.grid,
      this.state.grid[from.index],
      {
        passantIndex: this.state.passantIndex,
        castleStatus: this.state.castleStatus
      }
    ).includes(to.index)
  }
  
  execute({ from, to }) {
    const newGrid = chess.performMove(this.state.grid, from, to)
    this.state.grid = new ArraySchema()
    newGrid.forEach(g => this.state.grid.push(new Tile(g)))
    this.state.turnIndex = this.state.turnIndex === 1 ? 0 : 1
    this.state.lastMoveIndex = [from.index, to.index]
    this.state.activeCheck = chess.getActiveCheck(this.state.grid, this.state.turnIndex)
    this.state.activeCheckmate = chess.getActiveCheckmate(this.state.grid, this.state.turnIndex)
    this.state.inStaleMate = chess.getIsInStaleMate(this.state.grid, this.state.turnIndex)

    if (from.value.toLowerCase() === 'p' && Math.abs(from.index - to.index) > 8) {
      this.state.passantIndex = from.index + (from.value === from.value.toLowerCase() ? -8 : 8)
    } else {
      this.state.passantIndex = -1
    }


    // TODO: need to handle which rook was moved and only disable that side for castling, and move to chess lib
    if (from.value === 'k' || from.value === 'r') {
      this.state.castleStatus = this.state.castleStatus.replace(/kq/, '')
    } else if (from.value === 'K' || from.value === 'R') {
      this.state.castleStatus = this.state.castleStatus.replace(/KQ/, '')
    }
  }
}