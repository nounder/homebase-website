import {
  pipe,
  Schema,
} from "effect"

const Table = "Event"

export const Event = Schema.Struct({
  id: Schema.ULID,
})
