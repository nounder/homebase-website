import { createSignal, For, Show } from "solid-js"
import Videos from "../videos.json" with { type: "json" }

export function VideoGallery() {
  const [isExpanded, setIsExpanded] = createSignal(false)

  return (
    <div class="relative bg-white w-full p-4">
      <div class="text-3xl mb-4">
        <span class="font-bold">
          Videos
        </span>
      </div>

      <div class="relative">
        <div
          class="grid gap-4 grid-cols-2 md:grid-cols-3 overflow-hidden"
          style={{
            "max-height": isExpanded() ? "none" : "600px",
          }}
        >
          <For each={Videos}>
            {(video, index) => (
              <div class="relative">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block h-full group"
                >
                  <div class="group-hover:scale-[1.03] group-hover:rotate-1 transition-transform duration-200 h-full flex flex-col">
                    <img
                      loading="lazy"
                      src={video.imageUrl}
                      alt={video.title}
                      class="w-full aspect-video object-cover rounded-sm shadow-md"
                    />
                    <div class="mt-2 bg-white flex-grow">
                      <h3 class="line-clamp-2 text-md font-bold">
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

      <Show when={!isExpanded()}>
        <div class="sticky bottom-0 left-0 right-0 flex justify-center pb-6 z-20">
          <div style="
            position: absolute;
            top: -100%;
            z-index: -1;
            background: linear-gradient(to bottom, rgba(255 255 255 / 0%) 0%, rgba(255 255 255 / 100%) 40%);
            width: 100%;
            height: 200%;
          ">
          </div>
          <button
            class="cursor-pointer text-blue-500 font-bold py-3 px-6 rounded-lg transition-colors drop-shadow-md"
            onClick={() => setIsExpanded(true)}
          >
            See all videos
          </button>
        </div>
      </Show>
    </div>
  )
}
