import { HttpClient } from "@effect/platform"
import { Effect, Schema } from "effect"
import ICAL from "ical.js"

export const FetchCalendarEvents = (url: string) =>
  Effect.gen(function*() {
    // Get the HTTP client
    const httpClient = yield* HttpClient.HttpClient

    // Fetch the iCal data
    const response = yield* httpClient.get(url)
    const icalData = yield* response.text

    console.log(icalData)

    // Parse the iCal data
    const jcalData = ICAL.parse(icalData)
    const comp = new ICAL.Component(jcalData)
    const vevents = comp.getAllSubcomponents("vevent")

    // Convert to our event format
    const events = vevents.map(vevent => {
      const event = new ICAL.Event(vevent)

      // Format dates as ISO strings
      const startDate = event.startDate?.toJSDate()
      const endDate = event.endDate?.toJSDate()

      return {
        title: event.summary || "Untitled Event",
        description: event.description || null,
        link: event.location || null, // Using location as link since iCal doesn't have a standard link field
        start: startDate ? startDate.toISOString() : new Date().toISOString(),
        end: endDate ? endDate.toISOString() : new Date().toISOString(),
      }
    })

    return events
  })
