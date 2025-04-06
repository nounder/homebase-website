import {
  createEffect,
  createMemo,
  createRenderEffect,
  createSignal,
  For,
  onMount,
  Show,
} from "solid-js"
import { createCalendarLinks } from "../calendar"
import Workshops from "../workshops.json" with { type: "json" }

export function WorkshopListCard() {
  const [isExpanded, setIsExpanded] = createSignal(false)
  const [timezones, setTimezones] = createSignal<string[]>([])

  const [selectedTimezone, setSelectedTimezone] = createSignal(
    null as string | null,
  )

  // make sure it's called on the client side

  createEffect(() => {
    const timezones = Intl.supportedValuesOf("timeZone")
    setTimezones(timezones)
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    setSelectedTimezone(currentTimezone)
  })

  const days = createMemo(() => {
    const tz = selectedTimezone() ?? "UTC"

    const events = Workshops.days.flatMap(v => {
      return v.events.map(v => {
        return {
          ...v,
          start: new Date(v.start).toLocaleString("en-US", {
            timeZone: tz,
          }),
        }
      })
    })

    const dayEvents = events.reduce((acc, v) => {
      const day = new Date(v.start).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      acc[day] = [...(acc[day] || []), v]
      return acc
    }, {} as Record<string, typeof events>)

    return Object.keys(dayEvents).sort()
      .map((v, i) => ({
        title: Workshops.days[i]?.title ?? " ",
        date: v,
        events: dayEvents[v],
      }))
  })

  return (
    <div class="relative bg-white w-full rounded-md shadow-md border-[1px] border-gray-200 ">
      <div
        class="sticky flex justify-between top-0 border-b-[1px] border-gray-200 p-3 "
        style="background: linear-gradient(to bottom, rgba(245, 245, 245, 1), rgba(255, 255, 255, 1))"
      >
        <h2 class="text-3xl font-bold">
          Workshops
        </h2>
        <div
          class="flex items-center gap-2 mt-2"
          style="
          opacity: 0;
          animation: fade-in 0.2s ease-in-out forwards;
          animation-delay: 0.5s;
          "
        >
          <span class="text-sm text-gray-600">
            Timezone:
          </span>
          <select
            value={selectedTimezone() ?? "UTC"}
            class={`text-sm border border-gray-300 rounded px-2 py-1 appearance-none w-32`}
            onChange={e => setSelectedTimezone(e.target.value)}
          >
            <For each={timezones()}>
              {timezone => (
                <option value={timezone}>
                  {timezone}
                </option>
              )}
            </For>
          </select>
        </div>
      </div>

      <div
        class="flex flex-col gap-6 p-4 overflow-hidden"
        classList={{
          "h-170": !isExpanded(),
        }}
      >
        <For each={days()}>
          {day => (
            <div>
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
                <For each={day.events}>
                  {event => (
                    <div class="flex border-t-[1px] border-gray-200 pt-2 w-full">
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
                                  new Date(event.start).getTime()
                                    + 1.5 * 60 * 60 * 1000,
                                ),
                              }).ical}
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
                                  new Date(event.start).getTime()
                                    + 1.5 * 60 * 60 * 1000,
                                ),
                              }).google}
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
                          <For each={event.hosts}>
                            {host => (
                              <span class="group whitespace-nowrap shrink-0">
                                {typeof host === "string" ? host : (
                                  <>
                                    <Show when={host.pfp_url}>
                                      <img
                                        src={host.pfp_url}
                                        alt={host.name}
                                        class="rounded-full object-cover aspect-square w-6 inline mr-2"
                                      />
                                    </Show>
                                    <a
                                      href={host.profile_url ?? "#"}
                                      class="inline group-hover:underline whitespace-nowrap"
                                      target="_blank"
                                    >
                                      {host.name}
                                    </a>
                                  </>
                                )}
                              </span>
                            )}
                          </For>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>

      <Show when={!isExpanded()}>
        <div class="sticky bottom-0 left-0 right-0 flex justify-center pb-6 z-20">
          <div style="
            position: absolute;
            top: -100%;
            z-index: -1;
            background:  linear-gradient(to bottom, rgba(255 255 255 / 0%) 0%, rgba(255 255 255 / 100%) 40%);
            width: 100%;
            height: 200%;

          ">
          </div>
          <div class="w-full max-w-[960px] flex justify-center">
            <button
              class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition-colors shadow-md "
              onClick={() => setIsExpanded(true)}
            >
              See all workshops
            </button>
          </div>
        </div>
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
