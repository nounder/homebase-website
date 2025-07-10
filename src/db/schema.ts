import { SqlClient, SqlError } from "@effect/sql"
import { Console, Effect, Schema } from "effect"
import { YieldWrap } from "effect/Utils"

type NonGenMapper<IA> = (
  req: IA,
  sql: SqlClient.SqlClient,
) => Effect.Effect<unknown, SqlError.SqlError>

type GenMapper<IA> = (
  req: IA,
  sql: SqlClient.SqlClient,
) => Generator<YieldWrap<Effect.Effect<unknown, SqlError.SqlError>>>

type Mapper<IA> =
  | NonGenMapper<IA>
  | GenMapper<IA>

export function sqlSchema<II, IA, AA, AI>(
  Request: Schema.Schema<IA, II, never>,
  Result: Schema.Schema<AA, AI, never>,
) {
  return (
    map: Mapper<IA>,
  ) => {
    const decodeRequest = Schema.decode(Request)
    const decodeResult = Schema.decodeUnknown(Result)
    // we have to `as any` probably because of a bug:
    // @see https://github.com/Effect-TS/effect/issues/5190
    const mapFn = Effect.fn(map as any) as NonGenMapper<IA>

    return Object.assign(
      Effect.fnUntraced(function*(req: II) {
        const sql = yield* SqlClient.SqlClient
        const validatedReq = yield* decodeRequest(req)
        const rows = yield* mapFn(validatedReq, sql)

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
