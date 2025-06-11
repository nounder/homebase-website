import { SqlClient } from "@effect/sql"
import { Effect } from "effect"

export default Effect.gen(function*() {
  const sql = yield* SqlClient.SqlClient

  yield* sql`
create table "Event" (
  "id" text primary key,
  "title" text not null,
  "description" text,
  "link" text,
  "start" text not null,
  "end" text not null
);
`
})
