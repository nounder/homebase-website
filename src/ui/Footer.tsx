import { Infinity } from "lucide-solid";

export function Footer() {
  return (
    <div class="relative flex w-full justify-center bg-[#1761ff] flex-col items-center rounded-t-3xl py-10 overflow-hidden mt-8">
      <div class="relative z-10 flex flex-col items-center">
        {/* <InfinityIcon size="100px" class="text-white" /> */}
        <Infinity size="50px" class="text-white" />
        <span class="text-5xl font-bold text-white">Stay in the loop.</span>
        <span class="text-white/80 font-medium text-center max-w-md mt-2">
          Follow us on X, we regularly post about our based house, workshops &
          events.
        </span>
        <button class="mt-8 mb-10 bg-white px-5 py-2 font-medium rounded-full hover:scale-[1.05] text-[#1761ff] transition-all duration-[150ms] cursor-pointer">
          Follow @homebasedotlove
        </button>
      </div>
      <img 
        src="/HomebaseWorld.webp" 
        class="absolute left-1/2 transform opacity-[9%] -translate-x-1/2 translate-y-[55%] bottom-0 w-1/2 object-contain z-0" 
        alt="Homebase World"
      />
    </div>
  );
}
