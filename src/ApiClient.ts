import { HttpApi, HttpApiClient } from "@effect/platform"
import { Effect } from "effect"
import * as ApiServer from "./ApiServer"

// Create a program that derives and uses the client
const program = Effect.gen(function*() {
  // Derive the client
  const client = yield* HttpApiClient.make(ApiServer.MyApi, {
    baseUrl: "http://localhost:3000",
  })
  // Call the "hello-world" endpoint
  const hello = yield* client.Default.helloWorld({})
  console.log(hello)
})
