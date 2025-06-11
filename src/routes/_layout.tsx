import BasedPaint from "../../assets/BasedPaint414.png"
import { HouseLogo } from "../ui/HouseLogo.tsx"

export default function(props) {
  return (
    <div>
      <h1>
        <a href="/">
          Home
        </a>
      </h1>

      <div>
        {props.children}
      </div>
    </div>
  )
}
