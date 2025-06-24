import { Effect, ParseResult, pipe, Record, Schema } from "effect"

export function withGeneratedId<
  Fields extends {},
>(
  generate: () => string,
) {
  return (schema: Schema.Struct<Fields>) =>
    Schema.Struct({
      id: pipe(
        Schema.String,
        Schema.optionalWith({
          default: generate,
        }),
      ),
      ...schema.fields,
    })
}

/**
 * Given schema with 'passwordHash' field,
 * adds a 'password' field and hashes the password in 'passwordHash'
 */
export function withPasswordHash<
  Fields extends {
    password: Schema.Schema.Any
  },
>(
  hash: (password: string) => Promise<string>,
) {
  return (schema: Schema.Struct<Fields>) => {
    const restFields = Record.remove(
      schema.fields,
      "password",
    ) as unknown as Omit<
      Fields,
      "password"
    >

    return Schema.Struct({
      ...restFields,
      passwordHash: propertyPasswordHash(hash),
    })
  }
}

export function propertyPasswordHash(
  hash: (password: string) => Promise<string>,
) {
  return pipe(
    Schema.propertySignature(
      Schema.transformOrFail(
        Schema.String,
        Schema.String,
        {
          strict: true,
          decode: (input) =>
            Effect.tryPromise({
              try: () => Promise.resolve(hash(input)),
              catch: () =>
                new ParseResult.Unexpected(input, "Failed to hash password"),
            }),
          encode: (input, opts, ast) =>
            ParseResult.fail(
              new ParseResult.Forbidden(ast, input, "Cannot decode password"),
            ),
        },
      ),
    ),
    Schema.fromKey("password"),
  )
}
