import { HttpClient } from "@effect/platform"

import { Config, DateTime, Effect, Layer, pipe } from "effect"
import ICAL from "ical.js"
import * as Event from "../db/models/Event.ts"

const FetchCalendarEvents = (url: string) =>
  Effect.gen(function*() {
    const httpClient = yield* HttpClient.HttpClient

    const response = yield* httpClient.get(url)
    const icalData = yield* response.text

    const jcalData = ICAL.parse(icalData)
    const comp = new ICAL.Component(jcalData)
    const events = comp
      .getAllSubcomponents("vevent")
      .map(v => new ICAL.Event(v))
      .map(v => ({
        title: v.summary,
        description: v.description,
        link: v.location,
        start: pipe(
          DateTime.unsafeMake(v.startDate.toJSDate()),
          DateTime.formatIso,
        ),
        end: pipe(
          DateTime.unsafeMake(v.endDate.toJSDate()),
          DateTime.formatIso,
        ),
        icalId: v.uid,
      }))

    return events
  })

const SyncCalendar = Effect.gen(function*() {
  const icalUrl = yield* Config.string("HOMEBASE_LIVE_ICAL")

  while (1) {
    const events = yield* FetchCalendarEvents(icalUrl)

    for (const event of events) {
      const existingEvents = yield* Event.list()
      const existingEvent = existingEvents.find(e => e.icalId === event.icalId)

      if (existingEvent) {
        yield* Event.update({
          id: existingEvent.id,
          ...event,
        })
      } else {
        yield* Event.create(event)
      }
    }

    const currentIcalIds = events.map(event => event.icalId)
    yield* Event.remove(currentIcalIds)

    yield* Effect.logInfo(`Synced ${events.length} calendar events`)

    yield* Effect.sleep("5 seconds")
  }
})

/**
 * Sync iCal calendars to the database.
 */
export const layer = Layer.scopedDiscard(
  Effect.forkScoped(SyncCalendar),
)
