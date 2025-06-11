import { Loader2, VideoIcon, X } from "lucide-preact"
import { useState } from "react"
import Videos from "../videos.json" with { type: "json" }

interface Video {
  title: string
  imageUrl: string
  url: string
}

export function VideoGallery() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isVideoLoading, setIsVideoLoading] = useState(true)

  const getYoutubeEmbedUrl = (url: string): string | null => {
    if (!url) return null

    // Only handle YouTube URLs
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtube.com/watch?v=")
        ? url.split("v=")[1]?.split("&")[0]
        : url.includes("youtu.be/")
        ? url.split("youtu.be/")[1]?.split("?")[0]
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
    <div className="relative w-full">
      <div className="flex justify-between top-0  z-20">
        <h2 className="flex-col flex py-5 px-5 bg-white items-start w-full">
          <div className="flex items-center">
            <span className="text-5xl font-bold text-black">
              Videos
            </span>
          </div>
        </h2>
      </div>

      <div
        className={`flex flex-col  px-5 py-3 relative ${
          isExpanded ? "pb-20" : "overflow-hidden"
        }`}
        style={{
          maskImage: !isExpanded
            ? "linear-gradient(to bottom, black 70%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.4) 95%, transparent)"
            : "none",
          height: isExpanded ? "auto" : "1000px",
        }}
      >
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {(Videos as Video[]).map((video, index) => (
            <div key={index} className="relative select-none">
              <div
                onClick={() =>
                  openVideoModal(video)}
                className="block h-full group cursor-pointer"
              >
                <div className="group-hover:scale-[1.03] group-hover:rotate-1 transition-all duration-200 h-full flex flex-col">
                  <img
                    loading="lazy"
                    src={video
                      .imageUrl}
                    alt={video
                      .title}
                    className="w-full aspect-video pointer-events-none group-hover:shadow-3xl transition-all duration-[150ms] object-cover rounded-xl shadow-md"
                  />
                  <div className="bg-white flex-grow">
                    <h3 className="line-clamp-2 mt-2 text-md font-bold">
                      {video
                        .title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isExpanded && (
        <div className="sticky bottom-0 left-0 right-0 flex justify-center pb-6 z-20 mt-3">
          <div className="w-full max-w-[960px] flex justify-center">
            <div className="relative">
              <button
                className="relative z-10 cursor-pointer bg-white text-blue-500 font-bold py-3 px-6 rounded-xl transition-all border-[#1761ff] border-2 hover:bg-blue-50"
                onClick={() => setIsExpanded(true)}
              >
                See all videos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // Close when clicking the backdrop
            if (e.target === e.currentTarget) {
              closeVideoModal()
            }
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="flex justify-between items-center p-5">
              <h3 className="font-bold text-2xl text-blue-500 truncate pr-4">
                {selectedVideo?.title}
              </h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-0 flex-grow overflow-hidden relative">
              {getYoutubeEmbedUrl(selectedVideo?.url || "")
                ? (
                  <div className="aspect-video w-full relative">
                    {/* Loading indicator */}
                    {isVideoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-b-2xl">
                        <div className="flex flex-col items-center">
                          <Loader2
                            size={36}
                            className="text-[#1761ff] mb-2 animate-spin"
                          />
                        </div>
                      </div>
                    )}

                    <iframe
                      src={getYoutubeEmbedUrl(selectedVideo?.url || "")
                        || undefined}
                      title={selectedVideo?.title}
                      className="w-full h-full rounded-b-2xl select-none"
                      style={{ border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen={true}
                      onLoad={() => setIsVideoLoading(false)}
                    >
                    </iframe>
                  </div>
                )
                : (
                  <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 h-full">
                    <VideoIcon size={48} className="text-gray-400 mb-2" />
                    <p className="text-gray-600 text-lg">
                      This content can't be embedded.
                    </p>
                    <a
                      href={selectedVideo?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-xl transition-all duration-[150ms] text-white bg-[#1761ff] hover:bg-blue-700"
                    >
                      Open video externally
                    </a>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
