import { FetchHttpClient, HttpRouter, HttpServer } from "@effect/platform"
import { BunContext, BunHttpServer, BunRuntime } from "@effect/platform-bun"
import { Layer, pipe } from "effect"
import {
  BundleHttp,
  FileHttpRouter,
  FileRouter,
  HttpAppExtra,
  Router,
} from "effect-bundler"
import { BunBundle, BunTailwindPlugin } from "effect-bundler/bun"
import { SqlLive, SqlMigrator } from "./db/Sql.ts"
import * as CalendarSync from "./jobs/CalendarSync.ts"

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
  HttpRouter.use(FileHttpRouter.middleware()),
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
      Router.layer(() => import("./routes/_manifest.ts")),
      FileRouter.layer(import.meta.resolve("./routes")),
    ]),
    Layer.provide(BunContext.layer),
    Layer.launch,
    BunRuntime.runMain,
  )
}
