import { HttpClient } from "@effect/platform"
import {
  Config,
  Console,
  DateTime,
  Effect,
  Exit,
  Layer,
  Option,
  pipe,
} from "effect"
import ICAL from "ical.js"
import * as Event from "../db/models/Event.ts"

const fetchCalendarEvents = Effect.fn(function*(url: string) {
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

const syncCalendar = Effect.fn(function*() {
  const icalUrl = yield* Config.string("HOMEBASE_LIVE_ICAL")

  yield* Console.log(`Syncing calendar from ${icalUrl}`)

  while (1) {
    const events = yield* fetchCalendarEvents(icalUrl)

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
export function layer() {
  return Layer.scopedDiscard(
    Effect.gen(function*() {
      const task = yield* Effect.forkScoped(syncCalendar())

      yield* Effect.forkScoped(Effect.gen(function*() {
        const exit = yield* task.await.pipe(
          Effect.map(Exit.causeOption),
          Effect.map(Option.getOrNull),
        )

        if (exit) {
          yield* Console.error("CalendarSync exited", exit)
        }
      }))
    }),
  )
}
