import { HttpServerResponse } from "@effect/platform"
import { Effect, Schema } from "effect"
import * as Endpoint from "effect-start/Endpoint"
import { Event } from "../../db/index.ts"

export const GET = Effect.gen(function*() {
  const events = yield* Event.list()

  return yield* HttpServerResponse.unsafeJson(events)
})

export const POST = Endpoint
