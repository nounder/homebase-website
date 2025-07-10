import * as FileSystem from "@effect/platform/FileSystem"
import * as SqliteClient from "@effect/sql-sqlite-bun/SqliteClient"
import * as SqliteMigrator from "@effect/sql-sqlite-bun/SqliteMigrator"
import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import * as Layer from "effect/Layer"
import * as NPath from "node:path"
import * as NUrl from "node:url"

const migrationsDir = NUrl.fileURLToPath(import.meta.resolve("./migrations/"))

const schemaDir = NUrl.fileURLToPath(import.meta.resolve("./"))

export const SqlLive = Effect
  .gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const dataPath = yield* pipe(
      Config.string("DATA_PATH"),
      Config.withDefault("./data"),
      Config.map(v => NPath.resolve(process.cwd(), v)),
    )
    const dbPath = `${dataPath}/main.db`

    yield* fs.makeDirectory(dataPath, {
      recursive: true,
    })

    return SqliteClient.layer({
      filename: dbPath,
    })
  })
  .pipe(
    Layer.unwrapEffect,
  )

export const SqlMigrator = SqliteMigrator
  .layer({
    loader: SqliteMigrator.fromFileSystem(migrationsDir),
    schemaDirectory: schemaDir,
    table: "_Migration",
  })
  .pipe(
    Layer.provide(SqlLive),
  )
