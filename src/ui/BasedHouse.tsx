import { createSignal } from "solid-js"
import BasePaint414 from "../../public/BasedPaint414.png"
import { Home, Users } from "lucide-solid"

export function BasedHouseCard() {
  return (
    <div class="flex flex-row max-sm:flex-col-reverse items-center bg-white w-full p-4 my-6 gap-8 max-sm:text-center">
      <div class="flex flex-col gap-2 justify-center">
        <h2 class="text-5xl font-bold flex items-center gap-2">
          <Users size="45px" />
          Based houses
        </h2>
        <div class="text-xl text-gray-600 w-[700px]">
          Physical spaces for builders and creators to gather, work, and learn
          together.
        </div>

        <div>
          <a
            href="https://warpcast.com/rafi/0x14fd4e8e"
            class="hover:opacity-70 font-semibold hover:pl-3.5 py-2 transition-all duration-200 rounded-lg pr-5 hover:bg-[#1761ff]/10 text-[#1761ff] text-lg inline-flex items-center gap-2"
            target="_blank"
          >
            Learn more
            <span class="transition-all duration-200">
              ›
            </span>
          </a>
        </div>
      </div>

      <div class="flex-grow aspect-square max-sm:w-[50vw] md:w-[50%]">
        <BasedHouseBlueprint />
        <div class="text-gray-600 text-center mt-8 z-[10000]">
          BasedPaint #414 by creamy.eth
        </div>
      </div>
    </div>
  )
}

export function BasedHouseBlueprint() {
  const [rotation, setRotation] = createSignal({
    x: 30,
    y: -20,
  })

  return (
    <div
      class="aspect-square bg-cover bg-center bg-no-repeat relative"
      style={{
        "background-image": `url(/BasedPaint414.png)`,
        transform:
          `perspective(1000px) rotateY(${rotation().y}deg) rotateX(${rotation().x}deg)`,
        "transform-style": "preserve-3d",
        "box-shadow": "8px 8px 16px rgba(0, 0, 0, 0.2)",
        transition: "transform 0.3s ease",
      }}
      onMouseMove={(e) => {
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateY = (x - centerX) / 20
        const rotateX = (centerY - y) / 20

        setRotation({
          x: rotateX,
          y: rotateY,
        })
      }}
      onMouseLeave={() => {
        setRotation({
          x: 40,
          y: -20,
        })
      }}
    >
      <div
        class="absolute inset-0 -z-10"
        style={`
            background-image: url(${BasePaint414});
            transform: translateZ(-20px) scale(1.05);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
          `}
      >
      </div>
      <div
        class="absolute -right-2 -bottom-2 top-2 w-8 bg-gray-300 -z-20"
        style="transform: rotateY(-90deg) translateX(-4px); transform-origin: right;"
      >
      </div>
      <div
        class="absolute -bottom-2 -left-2 right-2 h-8 bg-gray-400 -z-20"
        style="transform: rotateX(90deg) translateY(-4px); transform-origin: bottom;"
      >
      </div>
    </div>
  )
}
