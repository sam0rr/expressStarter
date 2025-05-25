FROM oven/bun:latest

WORKDIR /app

COPY package.json ./

RUN bun install --production

COPY . .

EXPOSE 3000

CMD ["bun", "src/index.js"]
