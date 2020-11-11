import { type, Schema, ArraySchema } from '@colyseus/schema'
import { Player } from './Player'
import * as chess from './../../lib/chess'

export class Tile extends Schema {
  @type("number")
  index: number;

  @type("string")
  value: string;

  constructor({ index, value }) {
    super()
    this.index = index
    this.value = value
  }
}

export class RoomState extends Schema {

  @type("number")
  turnIndex: number;

  @type(["number"])
  lastMoveIndex;

  @type([Player])
  players = new ArraySchema<Player>();

  @type(["number"])
  activeCheck = [];

  @type('boolean')
  activeCheckmate = false;

  @type('boolean')
  inStaleMate = false;

  @type([Tile])
  grid = new ArraySchema<Tile>();
  
  constructor() {
    super()
    this.turnIndex = 0;
    const grid = chess.getInitialGrid()
    grid.forEach(g => this.grid.push(new Tile(g)))
  }
}
