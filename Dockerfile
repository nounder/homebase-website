FROM oven/bun:1.2-alpine AS base
WORKDIR /usr/src/app

COPY .output .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "server/index.mjs" ]
