FROM oven/bun:1-alpine AS base

WORKDIR /usr/src/app

COPY package.json bun.lock .

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["bun", "start"]
