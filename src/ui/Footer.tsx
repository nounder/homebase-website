import { HeaderLogo } from "./Header.tsx"
import { Socials } from "./Socials.tsx"

export function Footer() {
  return (
    <div class="bg-[#1761ff] min-h-[500px] w-full p-5 overflow-hidden relative">
      <div class="relative">
        {/* White curved top section */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "0",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            clipPath: "ellipse(min(100vw, 1200px) 120px at 50% 50%)",
            width: "200%",
            height: "240px",
            zIndex: "1",
          }}
        >
        </div>

        {/* Content section with proper spacing */}
        <div class="relative pt-40 md:pt-40 pb-4 md:pb-4">
          <div class="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
            <h2 class="text-white text-4xl md:text-5xl font-bold leading-tight">
              Stay in the loop
            </h2>
            <p class="text-white/70 text-lg md:text-xl font-medium max-w-2xl">
              We regularly post about our based house, workshops & events.
            </p>
            <div class="pt-4 text-white">
              <Socials />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
