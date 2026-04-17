FROM oven/bun:1.3.12-alpine

WORKDIR /app

COPY package.json bun.lock /app/
COPY admin/package.json /app/admin/package.json
COPY api/package.json /app/api/package.json
COPY packages/db/package.json /app/packages/db/package.json
COPY packages/logger/package.json /app/packages/logger/package.json

RUN bun i --frozen-lockfile

COPY . .

RUN bun run build:api

CMD ["bun", "start:api"]
