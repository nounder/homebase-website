import {
  FetchHttpClient,
  HttpMiddleware,
  HttpRouter,
  HttpServer,
  HttpServerResponse,
} from "@effect/platform"
import { BunContext, BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { Effect, Layer, pipe } from "effect"
import {
  BundleHttp,
  FileHttpRouter,
  FileRouter,
  HttpAppExtra,
} from "effect-bundler"
import { BunBundle, BunTailwindPlugin } from "effect-bundler/bun"
import { SqlLive, SqlMigrator } from "./db/Sql.ts"
import * as CalendarSync from "./jobs/CalendarSync.ts"

import IndexHtml from "./index.html" with { type: "file" }
import { Servers } from "./routes/_manifest.ts"

const BundlePath = "/_bundle"

export const App = HttpRouter.empty.pipe(
  HttpRouter.get(
    "*",
    BundleHttp.entrypoint(IndexHtml),
  ),
  HttpRouter.mountApp(
    BundlePath,
    BundleHttp.httpApp(),
  ),
  HttpRouter.use(
    HttpMiddleware.make(app => {
      return Effect.gen(function*() {
        const fileRouter = yield* FileHttpRouter.make(Servers)
        const fileRes = yield* fileRouter.pipe(
          Effect.catchTag("RouteNotFound", () => Effect.succeed(null)),
        )

        if (fileRes === null) {
          return yield* app
        }

        return fileRes
      })
    }),
  ),
  HttpAppExtra.withErrorHandled,
)

const ClientBundle = BunBundle
  .bundleClient({
    entrypoints: [
      IndexHtml,
    ],
    publicPath: `${BundlePath}/`,
    plugins: [
      BunTailwindPlugin.make(),
    ],
  })

export const layerServer = () =>
  pipe(
    HttpServer.serve(App),
    HttpServer.withLogAddress,
    Layer.provide([
      CalendarSync.layer,
      BunHttpServer.layer({
        port: 3000,
      }),
    ]),
    Layer.provide([
      FetchHttpClient.layer,
      SqlLive,
      SqlMigrator,
    ]),
  )

if (import.meta.main) {
  pipe(
    layerServer(),
    Layer.provide([
      ClientBundle.devLayer,
      FileRouter.layer(import.meta.resolve("./routes")),
    ]),
    Layer.provide(BunContext.layer),
    Layer.launch,
    BunRuntime.runMain,
  )
}
