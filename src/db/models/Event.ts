import { pipe, Schema } from "effect"
import { sqlSchema } from "../schema.ts"

const Table = "Event"

export const Event = Schema.Struct({
  id: Schema.ULID,
})

export const list = sqlSchema(
  Schema.Void,
  Schema.Array(Event),
)((req, sql) =>
  sql`
select *
from ${sql(Table)}
  `
)
