import { useEffect, useMemo } from "preact"
import {
  For,
  Show,
  Signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "preact/signals"
import { createCalendarLinks } from "../calendar.ts"
import Workshops from "../workshops.json" with { type: "json" }

// Types
interface Host {
  name: string
  profile_url?: string
  pfp_url?: string
}

interface WorkshopEvent {
  start: string
  title: string
  description?: string
  luma_url?: string
  hosts: (string | Host)[]
}

interface ProcessedEvent extends Omit<WorkshopEvent, "start"> {
  start: string // This will be the localized time string
}

interface DayData {
  title: string
  date: string
  events: ProcessedEvent[]
}

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

// Components
interface LocationPickerProps {
  selectedTimezone: string
  timezones: Signal<string[]>
  onTimezoneChange: (timezone: string) => void
}

function LocationPicker(
  { selectedTimezone, timezones, onTimezoneChange }: LocationPickerProps,
) {
  return (
    <div
      class="flex items-center gap-2 mt-2"
      style="
        opacity: 0;
        animation: fade-in 0.2s ease-in-out forwards;
        animation-delay: 0.5s;
      "
    >
      <span class="text-sm text-gray-600">
        Location:
      </span>
      <select
        value={selectedTimezone}
        class={`text-sm border border-gray-300 rounded px-2 py-1 appearance-none w-32`}
        onChange={e => {
          onTimezoneChange((e.target as HTMLSelectElement).value)
        }}
      >
        {timezones.value.map(timezone => (
          <option key={timezone} value={timezone}>
            {timezone
              .split("/")
              .at(-1)!
              .replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </div>
  )
}

interface ExpandButtonProps {
  onExpand: () => void
}

function ExpandButton({ onExpand }: ExpandButtonProps) {
  return (
    <div class="sticky bottom-0 left-0 right-0 flex justify-center pb-6 z-20">
      <div class="w-full max-w-[960px] flex justify-center">
        <button
          class="btn "
          onClick={onExpand}
        >
          See all workshops
        </button>
      </div>
    </div>
  )
}

interface DayElementProps {
  day: DayData
  onRef?: (el: HTMLDivElement | null) => void
}

function DayElement({ day, onRef }: DayElementProps) {
  return (
    <div ref={onRef}>
      <div class="flex items-center gap-2">
        <div class="w-12 h-12 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden mb-2">
          <div class="bg-red-500 text-white text-xs font-semibold py-0.5 text-center">
            {new Date(day.date).toLocaleDateString("en-US", {
              month: "short",
            })}
          </div>
          <div class="flex-1 flex items-center justify-center text-md font-bold">
            {new Date(day.date).getDate()}
          </div>
        </div>

        <div class="flex flex-col">
          <span class="text-lg">
            {day.title}
          </span>

          <span class="text-md text-gray-500">
            {new Date(day.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div class="flex flex-col ml-18 gap-4 mt-4">
        {day.events.map((event: ProcessedEvent, eventIndex: number) => (
          <div
            key={eventIndex}
            class="flex border-t-[1px] border-gray-200 pt-2 w-full"
          >
            <div class="w-full">
              <div class="flex items-center w-full gap-1 text-gray-500 text-sm">
                <div class="flex items-center">
                  <ClockIcon size="16px" />
                  <span class="mx-1">
                    {new Date(event.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div class="line-clamp-1">
                  🗓️{"  "}
                  <a
                    title="Add to Apple / iCalendar"
                    href={createCalendarLinks({
                      title: event.title,
                      start: new Date(event.start),
                      end: new Date(
                        new Date(event.start).getTime() + 1.5 * 60 * 60 * 1000,
                      ),
                    })
                      .ical}
                    class="hover:underline"
                  >
                    iCalendar
                  </a>
                  {" • "}
                  <a
                    title="Add to Google Calendar"
                    target="_blank"
                    href={createCalendarLinks({
                      title: event.title,
                      start: new Date(event.start),
                      end: new Date(
                        new Date(event.start).getTime() + 1.5 * 60 * 60 * 1000,
                      ),
                    })
                      .google}
                    class="hover:underline"
                  >
                    Google
                  </a>
                  {" • "}
                  <a
                    href={event.luma_url ?? ""}
                    target="_blank"
                    class="hover:underline"
                  >
                    Luma
                  </a>
                </div>
              </div>

              <a
                class="block font-bold text-xl mt-1 mb-2 hover:underline"
                href={event.luma_url ?? ""}
                target="_blank"
              >
                {event.title}
              </a>

              <div>
                {event.description}
              </div>

              <div class="flex items-center gap-4 text-sm overflow-x-auto">
                {event.hosts.map((host: string | Host, hostIndex: number) => (
                  <div
                    key={hostIndex}
                    class="group flex flex-row whitespace-nowrap shrink-0"
                  >
                    {typeof host === "string" ? host : (
                      <>
                        {host.pfp_url && (
                          <div className="avatar pr-3">
                            <div style="width: 24px;">
                              <img
                                src={host.pfp_url}
                                class="object-contain aspect-square rounded-full"
                              />
                            </div>
                          </div>
                        )}
                        <a
                          href={host.profile_url ?? "#"}
                          class="inline group-hover:underline whitespace-nowrap"
                          target="_blank"
                        >
                          {host.name}
                        </a>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WorkshopListCard() {
  const isExpanded = useSignal(false)
  const collapsed = useComputed(() => !isExpanded.value)
  const timezones = useSignal<string[]>([])
  const selectedTimezone = useSignal<string | null>(null)

  // Initialize timezones on client side
  useEffect(() => {
    const supportedTimezones = Intl.supportedValuesOf("timeZone")
    timezones.value = supportedTimezones
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    selectedTimezone.value = currentTimezone
  })

  const days = useComputed(() => {
    const tz = selectedTimezone.value ?? "UTC"

    const events = Workshops.days.flatMap(v => {
      return v.events.map(event => {
        return {
          ...event,
          start: new Date(event.start).toLocaleString("en-US", {
            timeZone: tz,
          }),
        }
      })
    })

    const dayEvents = events.reduce((acc, v) => {
      const day = formatDate(v.start)
      acc[day] = [...(acc[day] || []), v]
      return acc
    }, {} as Record<string, typeof events>)

    return Object
      .keys(dayEvents)
      .sort()
      .map((v, i) => ({
        title: Workshops.days[i]?.title ?? " ",
        date: v,
        events: dayEvents[v],
      }))
  })

  const daysElements = useSignal<(HTMLDivElement | null)[]>([])
  useSignalEffect(() => {
    daysElements.value = Array.from({ length: days.value.length }, () => null)
  })

  const latestDayIndex = useSignal(0)

  useSignalEffect(() => {
    // Find today's date or the last day if all events are in the past
    const today = formatDate(new Date())

    let targetIndex = Math.max(
      -1,
      days.value.findIndex(day => day.date >= today),
    )
    if (targetIndex === -1) {
      targetIndex = days.value.length - 1
    }

    latestDayIndex.value = targetIndex

    setTimeout(() => {
      // Get the corresponding element
      const targetDayElement = daysElements.value[latestDayIndex.value]

      if (!targetDayElement) {
        return
      }

      const overflowContainer = targetDayElement.closest(
        ".overflow-hidden",
      ) as HTMLElement
      if (overflowContainer) {
        const margin = targetDayElement.offsetHeight * 0.4
        const targetPosition = targetDayElement.offsetTop
          - overflowContainer.offsetTop
          - margin

        overflowContainer.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    }, 100)
  })

  const handleExpand = () => {
    isExpanded.value = true

    // Scroll to the latest day after expanding
    setTimeout(() => {
      const targetDayElement = daysElements.value.at(latestDayIndex.value)

      if (!targetDayElement) {
        return
      }

      targetDayElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 20)
  }

  const handleTimezoneChange = (timezone: string) => {
    selectedTimezone.value = timezone
  }

  return (
    <div class="relative bg-white w-full rounded-md shadow-md border-[1px] border-gray-200 ">
      <div
        class="sticky flex justify-between top-0 border-b-[1px] border-gray-200 p-3 z-20"
        style="background: linear-gradient(to bottom, rgba(245, 245, 245, 1), rgba(255, 255, 255, 1))"
      >
        <h2 class="text-3xl font-bold">
          Workshops
        </h2>
        <LocationPicker
          selectedTimezone={selectedTimezone.value ?? "UTC"}
          timezones={timezones}
          onTimezoneChange={handleTimezoneChange}
        />
      </div>

      <div
        class="flex flex-col gap-6 p-4 overflow-hidden relative"
        style={{
          "mask-image": !isExpanded.value
            ? "linear-gradient(to bottom, transparent, black 100px, black calc(100% - 160px), transparent)"
            : "none",
          height: isExpanded.value ? "auto" : "1000px",
        }}
      >
        <For each={days}>
          {(day: DayData, i: number) => (
            <DayElement
              day={day}
              onRef={el => {
                daysElements.value[i] = el
              }}
            />
          )}
        </For>
      </div>

      <Show when={collapsed}>
        <ExpandButton onExpand={handleExpand} />
      </Show>
    </div>
  )
}

function ClockIcon(props: {
  size?: any
  class?: any
}) {
  return (
    <svg
      width={props.size ?? "100%"}
      height={props.size ?? "100%"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 7V12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
