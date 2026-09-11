import { House } from "./dots.ts"
import { DotMatrix } from "./DotMatrix.tsx"

interface HouseLogoProps {
  class?: string
  label?: string
}

export function HouseLogo(props: HouseLogoProps) {
  return (
    <DotMatrix
      map={House}
      class={props.class}
      label={props.label}
    />
  )
}
