import { Effect, pipe, Schema } from "effect"
import { ulid } from "ulid"
import { sqlSchema } from "../schema.ts"
import { withGeneratedId } from "../utils.ts"

const Table = "Event"

export const EventDetails = Schema.Struct({
  title: Schema.String,
  description: pipe(
    Schema.String,
    Schema.NullOr,
  ),
  link: pipe(
    Schema.String,
    Schema.NullOr,
  ),
  start: Schema.String,
  end: Schema.String,
  icalId: pipe(
    Schema.String,
    Schema.NullOr,
  ),
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
    Schema.ArrayEnsure,
  ),
  Schema
    .NonEmptyArray(Event)
    .pipe(Schema.headNonEmpty),
)((req, sql) =>
  sql`
insert into ${sql(Table)}
${sql.insert(req)}
returning *
  `
)

export const update = sqlSchema(
  pipe(
    Schema.Struct({
      id: Schema.ULID,
      ...EventDetails.fields,
    }),
    Schema.ArrayEnsure,
  ),
  Schema.Void,
)((req, sql) => {
  const updates = req.map(event => {
    return sql`
update ${sql(Table)}
set ${sql.update(event)}
where id = ${event.id}
returning *
  `
  })

  // TODO: make sure to send it in one sql statement to make sure it is atomic
  return Effect.all(updates)
})

export const remove = sqlSchema(
  pipe(
    Schema.String,
    Schema.ArrayEnsure,
  ),
  Schema.Void,
)((req, sql) =>
  sql`
delete from ${sql(Table)}
where icalId not in ${sql.in(req)} and icalId is not null
  `
)
