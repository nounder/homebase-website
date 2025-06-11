import { HttpServerResponse } from "@effect/platform"
import { Config, Effect, Schema } from "effect"
import { FetchCalendarEvents } from "../../jobs/FetchCalendarData.ts"

export const GET = Effect.gen(function*() {
  const icalUrl = yield* Config.string("HOMEBASE_LIVE_ICAL")
  const events = yield* FetchCalendarEvents(icalUrl)

  return yield* HttpServerResponse.unsafeJson(events)
})
