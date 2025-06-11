import { useState } from "preact"
import BasePaint414 from "../../assets/BasedPaint414.png"

export function BasedHouseCard() {
  return (
    <div class="flex flex-row max-sm:flex-col-reverse items-center bg-white w-full p-4 my-8 gap-8 max-sm:text-center">
      <div class="flex flex-col gap-2 justify-center">
        <h2 class="text-5xl font-bold flex items-center gap-2">
          {/* <Users size="45px" /> */}
          Based houses
        </h2>
        <div class="text-xl text-gray-600 w-[700px]">
          Physical spaces for builders and creators to gather, work, and learn
          together.
        </div>

        <div>
          <a
            href="https://warpcast.com/rafi/0x14fd4e8e"
            class="hover:opacity-70 font-semibold py-2 transition-all duration-[150ms] rounded-xl hover:underline text-[#1761ff] text-lg inline-flex items-center"
            target="_blank"
          >
            Learn more
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
  const [rotation, setRotation] = useState({
    x: 30,
    y: -20,
  })

  console.log("BasePaint414 import:", BasePaint414)
  console.log("BasePaint414 type:", typeof BasePaint414)

  return (
    <div
      class="aspect-square relative"
      style={{
        transform:
          `perspective(1000px) rotateY(${rotation.y}deg) rotateX(${rotation.x}deg)`,
        transformStyle: "preserve-3d",
        boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.2)",
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
      {/* Main image */}
      <img
        src={BasePaint414}
        alt="BasedPaint #414"
        class="w-full h-full object-cover"
        onError={(e) => {
          console.error("Image failed to load:", BasePaint414)
          console.error("Error event:", e)
        }}
        onLoad={() => {
          console.log("Image loaded successfully:", BasePaint414)
        }}
      />

      {/* Shadow layer */}
      <img
        src={BasePaint414}
        alt=""
        class="absolute inset-0 w-full h-full object-cover -z-10"
        style={{
          transform: "translateZ(-20px) scale(1.05)",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* 3D side faces */}
      <div
        class="absolute -right-2 -bottom-2 top-2 w-8 bg-gray-300 -z-20"
        style={{
          transform: "rotateY(-90deg) translateX(-4px)",
          transformOrigin: "right",
        }}
      >
      </div>
      <div
        class="absolute -bottom-2 -left-2 right-2 h-8 bg-gray-400 -z-20"
        style={{
          transform: "rotateX(90deg) translateY(-4px)",
          transformOrigin: "bottom",
        }}
      >
      </div>
    </div>
  )
}
