import { Title } from "@solidjs/meta";
import { For, onMount } from "solid-js";
import { BasedHouseCard } from "../ui/BasedHouse";
import { Header } from "../ui/Header";
import { VideoGallery } from "../ui/VideoGallery";
import { WorkshopListCard } from "../ui/Workshop";
import { Footer } from "../ui/Footer";
import { Map } from "../ui/Map";

export default function Home() {
  onMount(() => {
    import("@farcaster/frame-sdk").then((mod) => mod.sdk.actions.ready());
  });

  return (
    <main>
      <Header />

      <div class="flex w-full absolute items-center justify-center z-[10000]">
        <button class="text-white mb-3 cursor-pointer hover:scale-[1.05] transition-all duration-[150ms] py-3 px-6 bg-black rounded-full px-4" onClick={() => window.open("https://x.com/homebasedotlove", "_blank")}>
          Follow @homebasedotlove
        </button>
      </div>

      <div
        class={`flex flex-col w-full max-w-[1140px] mx-auto z-10 mt-20`}
      >
       <Map />
      </div>

      <div
        class={`flex flex-col mt-3 w-full max-w-[1140px] mx-auto z-10 mt-8 relative shadow-[0_0_45px_rgba(23,97,255,0.15)] gap-8 overflow-hidden rounded-2xl`}
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
        class={`flex flex-col pt-6 w-full max-w-[1140px] mx-auto z-[1] relative gap-8`}
      >
        <Footer />
      </div>
    </main>
  );
}
