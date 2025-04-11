import { Title } from "@solidjs/meta"
import { For } from "solid-js"
import { BasedHouseCard } from "../ui/BasedHouse"
import { Header } from "../ui/Header"
import { VideoGallery } from "../ui/VideoGallery"
import { WorkshopListCard } from "../ui/Workshop"

export default function Home() {
  return (
    <main>
      <Header />

      <div class="md:h-8">
      </div>

      <div class="flex flex-col pt-6 w-full max-w-[840px] mx-auto z-10 relative gap-8 sm:px-4">
        <WorkshopListCard />
      </div>

      <div class="flex flex-col pt-6 w-full max-w-[840px] mx-auto z-10 relative gap-8">
        <BasedHouseCard />
      </div>

      <div class="flex flex-col pt-6 w-full max-w-[1140px] mx-auto z-10 relative gap-8">
        <VideoGallery />
      </div>
    </main>
  )
}
