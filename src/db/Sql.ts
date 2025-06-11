import { FileSystem } from "@effect/platform"
import { SqliteClient, SqliteMigrator } from "@effect/sql-sqlite-bun"
import { Config, Effect, Layer, pipe } from "effect"
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
