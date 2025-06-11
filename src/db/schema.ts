import {
  SqlClient,
  SqlError,
  SqlResolver,
  SqlSchema,
} from "@effect/sql"
import {
  Effect,
  Schema,
} from "effect"

export function sqlSchema<
  II,
  IA,
  AA,
  AI,
>(
  Request: Schema.Schema<IA, II, never>,
  Result: Schema.Schema<AA, AI, never>,
) {
  return (
    map: (
      req: IA,
      sql: SqlClient.SqlClient,
    ) => Effect.Effect<unknown, SqlError.SqlError>,
  ) => {
    const decodeRequest = Schema.decode(Request)
    const decodeResult = Schema.decodeUnknown(Result)

    return Object.assign(
      (req: II) =>
        Effect.gen(function*() {
          const sql = yield* SqlClient.SqlClient
          const validatedReq = yield* decodeRequest(req)
          const rows = yield* map(validatedReq, sql)
          const result = yield* decodeResult(rows)

          return result as AA
        }),
      {
        Request,
        Result,
      },
    )
  }
}
