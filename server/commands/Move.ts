import { Command } from "@colyseus/command"
import * as chess from './../../lib/chess'
import { RoomState, Tile } from "../schema"
import { ArraySchema } from '@colyseus/schema'

export class MoveCommand extends Command<RoomState, { from: any, to: any }> {
  validate({ from, to }) {
    const isBlack = chess.getIsBlack(from)
    if ((isBlack && this.state.turnIndex === 0) || (!isBlack && this.state.turnIndex === 1)) return false
    return chess.getPossibleMoves(this.state.grid, this.state.grid[from.index]).includes(to.index)
  }
  
  execute({ from, to }) {
    const newGrid = chess.performMove(this.state.grid, from, to)
    this.state.grid = new ArraySchema()
    newGrid.forEach(g => this.state.grid.push(new Tile(g)))
    this.state.turnIndex = this.state.turnIndex === 1 ? 0 : 1
    this.state.lastMoveIndex = [from, to]
  }
}