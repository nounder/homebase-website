import { DateTime, pipe, Schema } from "effect"
import { ulid } from "ulid"
import { sqlSchema } from "../schema.ts"
import { withGeneratedId } from "../utils.ts"

const Table = "Event"

export const EventDetails = Schema.Struct({
  title: Schema.String,
  description: Schema
    .String
    .pipe(Schema.NullOr),
  link: Schema
    .String
    .pipe(Schema.NullOr),
  start: Schema.String,
  end: Schema.String,
})

export const Event = Schema.Struct({
  id: Schema.ULID,
  ...EventDetails.fields,
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

export const find = sqlSchema(
  Schema.ULID,
  Schema.NonEmptyArray(Event).pipe(Schema.headNonEmpty),
)((req, sql) =>
  sql`
select *
from ${sql(Table)}
where id = ${req}
limit 1;
  `
)

export const create = sqlSchema(
  pipe(
    EventDetails,
    withGeneratedId(() => ulid()),
  ),
  Schema
    .NonEmptyArray(Event)
    .pipe(Schema.headNonEmpty),
)((req, sql) =>
  sql`
insert into ${sql(Table)}
${sql.insert([req])}
returning *
  `
)
