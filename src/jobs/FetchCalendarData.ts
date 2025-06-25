import { HttpClient } from "@effect/platform"
import { Config, DateTime, Effect, Layer, pipe, Schema } from "effect"
import ICAL from "ical.js"
import * as Event from "../db/models/Event.ts"

const ICalEvent = Schema.Struct({
  uid: Schema.String,
  summary: Schema.String,
  description: Schema
    .String
    .pipe(Schema.NullOr),
  location: Schema
    .String
    .pipe(Schema.NullOr),
  startDate: Schema.DateTimeUtcFromDate,
  endDate: Schema.DateTimeUtcFromDate,
})

const decodeEvents = Schema.decodeUnknown(Schema.Array(ICalEvent))

export const FetchCalendarEvents = (url: string) =>
  Effect.gen(function*() {
    // Get the HTTP client
    const httpClient = yield* HttpClient.HttpClient

    // Fetch the iCal data
    const response = yield* httpClient.get(url)
    const icalData = yield* response.text

    // Parse the iCal data
    const jcalData = ICAL.parse(icalData)
    const comp = new ICAL.Component(jcalData)
    const icalEvents = comp
      .getAllSubcomponents("vevent")
      .map(v => new ICAL.Event(v))
      .map(v => ({
        uid: v.uid,
        summary: v.summary,
        description: v.description,
        location: v.location,
        startDate: v.startDate.toJSDate(),
        endDate: v.endDate.toJSDate(),
      }))

    const events = yield* decodeEvents(icalEvents)

    return events
  })

/**
 * Sync iCal calendars to the database.
 */
export const layer = Layer.scopedDiscard(Effect.gen(function*() {
  const icalUrl = yield* Config.string("HOMEBASE_LIVE_ICAL")

  while (1) {
    const events = yield* FetchCalendarEvents(icalUrl)

    const eventData = events.map(event => ({
      title: event.summary,
      description: event.description,
      link: event.location,
      start: DateTime.formatIso(event.startDate),
      end: DateTime.formatIso(event.endDate),
      icalId: event.uid,
    }))

    console.log(eventData)

    for (const event of eventData) {
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

    const currentIcalIds = events.map(event => event.uid)
    yield* Event.remove(currentIcalIds)

    yield* Effect.logInfo(`Synced ${events.length} calendar events`)

    yield* Effect.sleep("5 seconds")
  }
}))
