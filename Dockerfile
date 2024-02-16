FROM node:21-alpine as deps
WORKDIR /app
COPY ./package.json .

RUN npm install

FROM node:21-alpine as builder
WORKDIR /app
COPY --from=deps /app/node_modules node_modules
COPY . .
RUN npm run build

FROM node:21-alpine as mail-consumer
WORKDIR /app
COPY --from=builder /app .
COPY prisma ./primsa

CMD [ "npm", "start" ]