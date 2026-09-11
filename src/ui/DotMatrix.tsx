import { byColumn, type DotMap, DotPitch, DotRadius } from "./dots.ts"

interface DotMatrixProps {
  map: DotMap
  class?: string
  label?: string
}

/**
 * Renders a dot grid as SVG. Dots are grouped per column so a stagger can be
 * applied with a single rule instead of a style on every dot.
 */
export function DotMatrix(props: DotMatrixProps) {
  const width = props.map.columns * DotPitch
  const height = props.map.rows * DotPitch

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      class={props.class}
      role={props.label ? "img" : undefined}
      aria-label={props.label}
      aria-hidden={props.label ? undefined : "true"}
    >
      {byColumn(props.map).map((dots, column) => (
        <g
          key={column}
          style={{
            animationDelay: `${column * 22}ms`,
          }}
        >
          {dots.map((dot) => (
            <circle
              key={dot.y}
              cx={dot.x * DotPitch + DotPitch / 2}
              cy={dot.y * DotPitch + DotPitch / 2}
              r={DotRadius}
            />
          ))}
        </g>
      ))}
    </svg>
  )
}
