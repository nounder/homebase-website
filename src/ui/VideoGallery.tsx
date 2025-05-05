import { createSignal, For, Show } from "solid-js"
import Videos from "../videos.json" with { type: "json" }
import { VideoIcon } from "lucide-solid"
import { Video } from "lucide-solid"
export function VideoGallery() {
  const [isExpanded, setIsExpanded] = createSignal(false)

  return (
    <div class="relative bg-white w-full flex flex-col items-center p-4">
      <div class="text-5xl w-fit justify-center px-5 py-3 rounded-xl bg-[#1761ff]/10 text-[#1761ff] font-bold flex items-center gap-3">
        <VideoIcon size="45px" />
        <span> Latest videos </span>
      </div>

      <div class="relative mt-8 w-full">
        <div
          class="grid gap-4 grid-cols-2 md:grid-cols-3"
          style={{
            "max-height": isExpanded() ? "none" : "600px",
            "overflow": isExpanded() ? "visible" : "hidden",
          }}
        >
          <For each={Videos}>
            {(video, index) => (
              <div class="relative select-none">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block h-full group"
                >
                  <div class="group-hover:scale-[1.03] group-hover:rotate-1 transition-all duration-200 h-full flex flex-col">
                    <img
                      loading="lazy"
                      src={video.imageUrl}
                      alt={video.title}
                      class="w-full aspect-video pointer-events-none group-hover:shadow-3xl transition-all duration-[150ms] object-cover rounded-xl shadow-md"
                    />
                    <div class="bg-white flex-grow">
                      <h3 class="line-clamp-2 mt-2 text-md font-bold">
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
        <div class="relative w-full flex justify-center mt-4 mb-6">
          <div class="absolute top-[-100px] left-0 right-0 h-[100px] bg-gradient-to-t from-white to-transparent"></div>
          <button
            class="relative z-10 cursor-pointer bg-white text-blue-500 font-bold py-3 px-6 rounded-xl transition-all border-[#1761ff] border-2 hover:bg-blue-50"
            onClick={() => setIsExpanded(true)}
          >
            See all videos
          </button>
        </div>
      </Show>
    </div>
  )
}
