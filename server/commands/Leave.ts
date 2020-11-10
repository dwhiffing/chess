import { Command } from "@colyseus/command"
import { RoomState } from "../schema"

export class LeaveCommand extends Command<RoomState, { playerId: string }> {
  execute({ playerId }) {
    this.state.players = this.state.players.filter(p => p.id !== playerId)
    if (!this.state.players.find(p => p.isAdmin)) {
      const firstPlayer = this.state.players[0]
      if (firstPlayer) firstPlayer.isAdmin = true
    }
  }
}