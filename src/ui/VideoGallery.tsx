import { For } from "solid-js"
import Videos from "../videos.json" with { type: "json" }

export function VideoGallery() {
  return (
    <div class="relative bg-white w-full p-4">
      <div class="text-3xl mb-4">
        <span class="font-bold">
          Videos
        </span>
      </div>

      <div class="overflow-hidden relative">
        <div
          class="flex overflow-x-auto pb-4 scrollbar-hide"
          style="scroll-snap-type: x mandatory;"
        >
          <For each={Videos}>
            {(video, index) => (
              <div class="flex-shrink-0 w-[400px] max-sm:w-[300px] pr-4 scroll-snap-align-start relative">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block h-full group"
                >
                  <div class="group-hover:opacity-85 transition-shadow duration-200 h-full flex flex-col">
                    <img
                      src={video.imageUrl}
                      alt={video.title}
                      class="w-full aspect-video object-cover rounded-sm shadow-md"
                    />
                    <div class="mt-2 bg-white flex-grow">
                      <h3 class="line-clamp-1 text-xl group-hover:underline">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </a>
              </div>
            )}
          </For>
        </div>
      </div>

      <style>
        {`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scroll-snap-align-start {
                    scroll-snap-align: start;
                }
            `}
      </style>
    </div>
  )
}
