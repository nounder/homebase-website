import {
  FetchHttpClient,
  HttpApp,
  HttpRouter,
  HttpServer,
  HttpServerResponse,
} from "@effect/platform"
import { BunContext, BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { Effect, Layer, pipe } from "effect"
import { BundleHttp, FileRouter } from "effect-bundler"
import { BunBundle, BunTailwindPlugin } from "effect-bundler/bun"
import { SqlLive, SqlMigrator } from "./db/Sql.ts"
import * as HttpAppExtra from "./HttpAppExtra.ts"

import IndexHtml from "./index.html" with { type: "file" }

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
  HttpRouter.get(
    "/events.json",
    await import("./routes/events/_server.ts").then(v => v.GET),
  ),
  HttpRouter.post(
    "/events.json",
    await import("./routes/events/_server.ts").then(v => v.POST),
  ),
  HttpRouter.get(
    "/hello",
    HttpServerResponse.text("Hello World!"),
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
      FetchHttpClient.layer,
      BunHttpServer.layer({
        port: 3000,
      }),
      FileRouter.layer(
        import.meta.resolve("./routes"),
        "_manifest.ts",
      ),
      SqlLive,
      SqlMigrator,
    ]),
  )

if (import.meta.main) {
  pipe(
    layerServer(),
    Layer.provide([
      ClientBundle.devLayer,
      BunContext.layer,
    ]),
    Layer.launch,
    BunRuntime.runMain,
  )
}
