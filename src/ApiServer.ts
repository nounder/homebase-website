import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
} from "@effect/platform"
import { Effect, Layer, Schema } from "effect"

// Define our API with one group named "Greetings" and one endpoint called "hello-world"
export const MyApi = HttpApi.make("Api").add(
  HttpApiGroup
    .make("Default")
    .add(
      HttpApiEndpoint.get("helloWorld")`/hello-world`
        .addSuccess(Schema.String),
    )
    .add(
      HttpApiEndpoint.get("hello")`/hello`
        .setPayload(Schema.Struct({
          name: Schema.String,
        }))
        .addSuccess(Schema.String),
    ),
)

// Implement the "Greetings" group
const GreetingsLive = HttpApiBuilder.group(
  MyApi,
  "Default",
  (handlers) =>
    handlers
      .handle("helloWorld", () => Effect.succeed("Hello, World!"))
      .handle("hello", () => Effect.succeed("Hello, World!")),
)

// Provide the implementation for the API
const MyApiLive = HttpApiBuilder.api(MyApi).pipe(Layer.provide(GreetingsLive))

// Set up the server using NodeHttpServer on port 3000
const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(MyApiLive),
)
