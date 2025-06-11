import { Button } from "../../ui/Button.tsx"

export default function() {
  return (
    <div>
      <h1>
        Events
      </h1>
      <Button
        onClick={() => {
          console.log("clicked")
        }}
      >
        Add event
      </Button>
    </div>
  )
}
