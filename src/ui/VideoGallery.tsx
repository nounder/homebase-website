import { createSignal, For, Show } from "solid-js"
import Videos from "../videos.json" with { type: "json" }
import { Loader2, VideoIcon, X } from "lucide-solid"

interface Video {
  title: string
  imageUrl: string
  url: string
}

export function VideoGallery() {
  const [isExpanded, setIsExpanded] = createSignal(false)
  const [selectedVideo, setSelectedVideo] = createSignal<Video | null>(null)
  const [isVideoLoading, setIsVideoLoading] = createSignal(true)
  
  const getYoutubeEmbedUrl = (url: string): string | null => {
    if (!url) return null
    
    // Only handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtube.com/watch?v=') 
        ? url.split('v=')[1]?.split('&')[0]
        : url.includes('youtu.be/') 
          ? url.split('youtu.be/')[1]?.split('?')[0]
          : null
          
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }
    
    return null
  }

  const openVideoModal = (video: Video) => {
    setSelectedVideo(video)
  }

  const closeVideoModal = () => {
    setSelectedVideo(null)
    // Reset loading state for next video
    setTimeout(() => setIsVideoLoading(true), 300)
  }

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
          <For each={Videos as Video[]}>
            {(video, index) => (
              <div class="relative select-none">
                <div
                  onClick={() => openVideoModal(video)}
                  class="block h-full group cursor-pointer"
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
                </div>
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
      
      {/* Video Modal */}
      <Show when={selectedVideo()}>
        <div 
          class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 z-[1000000]"
          onClick={(e) => {
            // Close when clicking the backdrop
            if (e.target === e.currentTarget) {
              closeVideoModal();
            }
          }}
        >
          <div 
            class="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl"
            style={{
              "box-shadow": "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
          >
            <div class="flex justify-between items-center p-5">
              <h3 class="font-bold text-2xl text-blue-500 truncate pr-4">
                {selectedVideo()?.title}
              </h3>
              <button 
                onClick={closeVideoModal}
                class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div class="p-0 flex-grow overflow-hidden relative">
              <Show when={getYoutubeEmbedUrl(selectedVideo()?.url || '')} fallback={
                <div class="flex flex-col items-center justify-center p-12 text-center space-y-4 h-full">
                  <VideoIcon size={48} class="text-gray-400 mb-2" />
                  <p class="text-gray-600 text-lg">This content can't be embedded.</p>
                  <a 
                    href={selectedVideo()?.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="mt-2 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1761ff] hover:bg-blue-700"
                  >
                    Open video externally
                  </a>
                </div>
              }>
                <div class="aspect-video w-full relative">
                  {/* Loading indicator */}
                  <Show when={isVideoLoading()}>
                    <div class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                      <div class="flex flex-col items-center">
                        <Loader2 size={36} class="text-[#1761ff] mb-2 animate-spin" />
                      </div>
                    </div>
                  </Show>
                  
                  <iframe
                    src={getYoutubeEmbedUrl(selectedVideo()?.url || '') || undefined}
                    title={selectedVideo()?.title}
                    class="w-full h-full rounded-lg"
                    style={{ border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen={true}
                    onLoad={() => setIsVideoLoading(false)}
                  ></iframe>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
