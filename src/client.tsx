import "effect-bundler/client"

import { render } from "preact"
import { App } from "./app.tsx"

render(<App />, document.getElementById("app")!)
