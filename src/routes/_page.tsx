import { useEffect } from "preact"
import { BasedHouseCard } from "../ui/BasedHouse"
import { Footer } from "../ui/Footer"
import { Header } from "../ui/Header"
import { Map } from "../ui/Map"
import { Socials } from "../ui/Socials"
import { VideoGallery } from "../ui/VideoGallery"
import { WorkshopListCard } from "../ui/Workshop"
import Events from "./Events.tsx"

export default function() {
  useEffect(() => {
    import("@farcaster/frame-sdk").then((mod) => mod.sdk.actions.ready())
  }, [])

  return (
    <main>
      <Header />
      <div class="flex w-full absolute items-center justify-center gap-x-3 mt-8 z-20 text-black">
        <Socials />
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
      <div class={`flex flex-col w-full max-w-[1140px] mx-auto mt-10`}>
        <Map />
      </div>
      <div class={`flex flex-col pt-6 w-full max-w-full relative gap-8`}>
        <Footer />
      </div>
    </main>
  )
}
