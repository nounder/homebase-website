/**
 * Creates calendar event links for Google Calendar and iCalendar
 * @param event The event details
 * @returns Object containing links for Google Calendar and iCalendar
 */
export function createCalendarLinks(event: {
    title: string;
    description?: string;
    location?: string;
    start: Date;
    end: Date;
}) {
    // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
    const formatGoogleDate = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    // Format dates for iCalendar (YYYYMMDDTHHMMSSZ)
    const formatICalDate = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    // Create Google Calendar link
    const googleCalendarLink =
        `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${
            encodeURIComponent(event.title)
        }&dates=${formatGoogleDate(event.start)}/${
            formatGoogleDate(event.end)
        }${
            event.description
                ? `&details=${encodeURIComponent(event.description)}`
                : ""
        }${
            event.location
                ? `&location=${encodeURIComponent(event.location)}`
                : ""
        }`;

    // Create iCalendar data
    const iCalData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Calendar Event Generator//EN",
        "BEGIN:VEVENT",
        `DTSTART:${formatICalDate(event.start)}`,
        `DTEND:${formatICalDate(event.end)}`,
        `SUMMARY:${event.title}`,
        event.description ? `DESCRIPTION:${event.description}` : "",
        event.location ? `LOCATION:${event.location}` : "",
        `UID:${new Date().getTime()}@calendar-generator`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].filter(Boolean).join("\r\n");

    // Create data URI for iCalendar download
    const iCalDataUri = `data:text/calendar;charset=utf-8,${
        encodeURIComponent(iCalData)
    }`;

    return {
        google: googleCalendarLink,
        ical: iCalDataUri,
    };
}
