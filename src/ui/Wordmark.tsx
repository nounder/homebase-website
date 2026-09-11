import { word } from "./dots.ts"
import { DotMatrix } from "./DotMatrix.tsx"

const Homebase = word("HOMEBASE")

interface WordmarkProps {
  class?: string
}

export function Wordmark(props: WordmarkProps) {
  return (
    <DotMatrix
      map={Homebase}
      class={props.class}
      label="Homebase"
    />
  )
}
