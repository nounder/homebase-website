import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { Effect, Schema } from "effect"
import { Event } from "../../db/index.ts"

export const GET = Effect.gen(function*() {
  const events = yield* Event.list()

  return yield* HttpServerResponse.json(events)
})

export const POST = Effect.gen(function*() {
  const req = yield* HttpServerRequest.HttpServerRequest
  const payload = yield* HttpServerRequest.schemaBodyJson(Event.EventDetails)

  console.log(payload)

  const createdEvent = yield* Event.create(payload)

  return yield* HttpServerResponse.json(createdEvent)
})
