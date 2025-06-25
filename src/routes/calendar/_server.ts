import { HttpServerResponse } from "@effect/platform"
import { Config, Effect, Schema } from "effect"
import * as Event from "../../db/models/Event.ts"

export const GET = Effect.gen(function*() {
  const events = yield* Event.list()

  return yield* HttpServerResponse.unsafeJson(events)
})
