function House() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 226 307"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M90.1803 9.37257C102.677 -3.12421 122.938 -3.12418 135.435 9.3726C135.435 9.3726 206.164 78.4427 216.746 90.2352C222.467 96.0164 226 103.967 226 112.743V113.743L226.002 113.745H226V274.743C226 292.416 211.673 306.743 194 306.743H32C14.3269 306.743 0 292.416 0 274.743V112.743C0 110.029 0.338013 107.393 0.974228 104.876C2.04395 100.242 4.28932 94.6956 9.00163 90.2451L90.1803 9.37257ZM193.253 193.743C193.253 237.926 157.379 273.743 113.126 273.743C71.0315 273.743 36.5182 241.334 33.2527 200.143H139.582V186.277H33.3444C37.1157 145.595 71.3955 113.743 113.126 113.743C157.379 113.743 193.253 149.56 193.253 193.743Z"
        fill="#fff"
      />
    </svg>
  )
}

export function Header() {
  return (
    <div style="
    background: #1761ff;
    margin-top: -80px;
    transform: translateY(80px);

          ">
      <div class="relative overflow-hidden">
        <div class="w-full max-w-[960px] mx-auto text-center flex flex-col items-center">
          <div class="mt-8 w-12">
            <House />
          </div>

          <div class="w-[50%] max-sm:w-[90%]">
            <HeaderLogo />
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
  const width = 425, height = 80, startY = 60, controlY = 40
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
        {letters.map(letter => (
          <text
            text-anchor={letter.textAnchor}
            fill="white"
            style={`
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
