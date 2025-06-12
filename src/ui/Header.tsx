import { HouseLogo } from "./HouseLogo.tsx"
import { Socials } from "./Socials.tsx"

export function Header() {
  return (
    <div style="
          background: #1761ff;
          margin-top: -80px;
          transform: translateY(80px);
        ">
      <div class="relative overflow-hidden">
        <div class="w-full max-w-[960px] mx-auto text-center flex flex-col items-center">
          <div class="mt-8 w-24 text-white">
            <HouseLogo />
          </div>

          <div class="w-[50%] max-sm:w-[90%]">
            <HeaderLogo />
          </div>

          <div class="flex flex-col items-center text-white/80 -mt-3 mb-5">
            Where based builders and creators come to grow.
          </div>

          <div class="text-white mb-4">
            <Socials />
          </div>
        </div>

        <div style="height: 100px">
          <div style="
              z-index: -1;
              position: absolute;
              left: 50%;
              bottom: 0;
              transform: translate(-50%, 50%);
              background: #fff;
              clip-path: ellipse(max(40%, 700px) 50% at 50% 50%);
              width: 140%;
              height: 200px;
            ">
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeaderLogo() {
  const width = 425,
    height = 80,
    startY = 60,
    controlY = 40
  const curve = {
    start: { x: 6, y: startY },
    control: { x: width / 2, y: controlY },
    end: { x: width - 6, y: startY },
  }
  const path =
    `M${curve.start.x},${curve.start.y} Q${curve.control.x},${curve.control.y} ${curve.end.x},${curve.end.y}`
  const text = "HOMEBASE"
  const totalChars = text.length
  const spacing = 100 / totalChars // Distribute evenly across 100% of the path
  const letters = text.split("").map((char, i) => ({
    i,
    char,
    offset: `${(i + 0.5) * spacing}%`,
    textAnchor: "middle" as const,
  }))

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      font-size="40px"
      font-weight="900"
    >
      <path id="curve" d={path} style="visibility: hidden" />

      <g fill="white">
        {letters.map((letter) => (
          <text
            text-anchor={letter.textAnchor}
            fill="white"
            style={`
                user-select: none;
                --hf: ${letter.i};
                --nounder-float-y: 1%;
                animation: nounder-float ease-in-out infinite;
                animation-duration: calc(1s * 2 * var(--hf, 1));
                animation-delay: calc(0.1 - var(--hf, 1) * 2);
                pointer-events: none;
              `}
          >
            <textPath href="#curve" startOffset={letter.offset}>
              {letter.char}
            </textPath>
          </text>
        ))}
      </g>
    </svg>
  )
}
