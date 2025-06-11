import { useEffect } from "preact/hooks"
import { BasedHouseCard } from "../ui/BasedHouse"
import { Footer } from "../ui/Footer"
import { Header } from "../ui/Header"
import { Map } from "../ui/Map"
import { VideoGallery } from "../ui/VideoGallery"
import { WorkshopListCard } from "../ui/Workshop"

export default function() {
  useEffect(() => {
    import("@farcaster/frame-sdk").then((mod) => mod.sdk.actions.ready())
  }, [])

  return (
    <main>
      <Header />

      <div class="flex w-full absolute items-center justify-center">
        <button
          class="text-white my-1.5 select-none font-medium border-black/20 border-2 cursor-pointer hover:bg-black/80 py-3 px-6 bg-black rounded-full px-4"
          onClick={() => window.open("https://x.com/homebasedotlove", "_blank")}
        >
          Follow @homebasedotlove
        </button>
      </div>

      <div
        class={`flex flex-col w-full max-w-[1140px] mx-auto z-10 mt-20`}
      >
        <Map />
      </div>

      <div
        class={`flex flex-col mt-3 w-full max-w-[1140px] mx-auto z-10 mt-8 relative gap-8`}
      >
        <WorkshopListCard />
      </div>

      <div
        class={`flex flex-col pt-6 w-full max-w-[1140px] mx-auto z-10 relative gap-8`}
      >
        <BasedHouseCard />
      </div>

      <div
        class={`flex flex-col pt-6 w-full max-w-[1140px] mx-auto z-10 relative gap-8`}
      >
        <VideoGallery />
      </div>
      <div
        class={`flex flex-col pt-6 w-full max-w-full relative gap-8`}
      >
        <Footer />
      </div>
    </main>
  )
}
