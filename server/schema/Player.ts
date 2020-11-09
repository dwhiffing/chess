import { type, Schema } from '@colyseus/schema'

export class Player extends Schema {
  reconnection: any

  @type('string')
  id = ''

  @type('string')
  name = ''

  @type('number')
  role = 0

  @type('boolean')
  connected = true

  @type('boolean')
  isAdmin = false

  @type('number')
  remainingConnectionTime = 0

  constructor(id: string) {
    super()
    this.id = id
  }
}

