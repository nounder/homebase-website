import {
  createEffect,
  createMemo,
  createRenderEffect,
  createSignal,
  For,
  onMount,
  Show,
  Suspense,
} from "solid-js"
import { createStore } from "solid-js/store"
import { createCalendarLinks } from "../calendar"
import Workshops from "../workshops.json" with { type: "json" }
import { PencilRulerIcon } from "lucide-solid"

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

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
      const day = formatDate(v.start)
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

  const [daysElements, setDaysElements] = createStore<any[]>([])
  createEffect(() => {
    setDaysElements(Array.from({ length: days().length }, () => null))
  })

  const [latestDayIndex, setLatestDayIndex] = createSignal(0)

  onMount(() => {
    // Find today's date or the last day if all events are in the past
    const today = formatDate(new Date())

    console.log({
      today,
      days: days(),
    })

    let targetIndex = Math.max(
      -1,
      days().findIndex(day => day.date >= today),
    )
    if (targetIndex === -1) {
      targetIndex = days().length - 1
    }

    setLatestDayIndex(targetIndex)
  })

  return (
    <>
      <div class="relative w-full ">
      <div
        class="sticky flex justify-between top-0 px-5 z-20"

      >
        <h2 class="flex-col px-10 flex pt-10 items-center w-full ">
          <div class="flex gap-2 items-center">
            <PencilRulerIcon size="40px" class="text-black" />
            <span class="text-5xl font-bold text-black">Workshops</span>
          </div>
          <span class="text-gray-500/80 text-lg font-medium">
            Learn about any topic, from anywhere.
          </span>
        </h2>
        <div>
          {/* When locations are needed, add the location dropdown */}
        </div>
        {/* <div
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
            value={selectedTimezone() ?? "UTC"}
            class={`text-sm border border-gray-300 rounded px-2 py-1 appearance-none w-32`}
            onChange={e => setSelectedTimezone(e.target.value)}
          >
            <For each={timezones()}>
              {timezone => (
                <option value={timezone}>
                  {timezone.split("/").at(-1)!.replaceAll("_", " ")}
                </option>
              )}
            </For>
          </select>
        </div> */}
      </div>

      <div
        class={`flex flex-col gap-6 px-20 mt-0 relative ${isExpanded() ? "pb-20 ":"overflow-hidden"}`}
        style={{
          "mask-image": !isExpanded()
            ? "linear-gradient(to bottom, black, black calc(100% - 160px), transparent)"
            : "none",
          height: isExpanded() ? "auto" : "1000px ",
        }}
      >
        <For each={days()}>
          {(day, i) => (
            <div ref={el => setDaysElements(i(), el)}  class="border-gray-200">
              <div class="flex items-center gap-2">
                <div class="w-12 h-12 bg-white rounded-lg mr-2 shadow-sm flex flex-col overflow-hidden mb-2">
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
                  <span class="text-lg font-semibold">
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

              <div class="flex flex-col ml-18 gap-4 mt-4 pb-3">
                <For each={day.events}>
                  {event => (
                    <div onClick={()=>{
                      window.open(event.luma_url ?? "")
                    }} class="flex w-full transition-all duration-[150ms] hover:bg-[#1761ff]/10 p-3 rounded-xl border-2 border-gray-100 cursor-pointer hover:border-[#1761ff]/30">
                      <div class="w-full">
                        <div class="flex flex-col  w-full gap-1 text-gray-500 text-sm">
                          <div class="flex flex-col ">
                            <span class="text-2xl font-semibold">
                            {event.title}
                            </span>
                           
                            <div class="flex w-full ">
                            <ClockIcon size="16px" />
                            <span class="mx-1">
                              {new Date(event.start).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            </div>
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


                        <div>
                          {event.description}
                        </div>

                        <div class="flex items-center gap-4 text-sm overflow-x-auto">
                          <For each={event.hosts}>
                            {host => (
                              <span class="group whitespace-nowrap shrink-0 mt-2">
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
          <div class="w-full max-w-[960px] flex justify-center">
            <button
              class="cursor-pointer bg-[#1761ff]/90 hover:bg-[#1761ff] text-white py-3 px-6 font-semibold rounded-xl transition-colors shadow-[0_0_10px_rgba(23,97,255,0.5)]"
              onClick={() => {
                setIsExpanded(true)
              }}
            >
              See all workshops
            </button>
          </div>
        </div>
      </Show>
    </div>
    </>
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
