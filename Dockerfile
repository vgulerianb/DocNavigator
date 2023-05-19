FROM node:lts as builder
WORKDIR /docnavigator
COPY .env package.json yarn.lock ./
RUN yarn install --frozen-lockfile
WORKDIR /docnavigator
COPY . .
RUN yarn build
FROM node:lts
WORKDIR /docnavigator

COPY --from=builder /docnavigator/node_modules ./node_modules
COPY --from=builder /docnavigator/next.config.js ./
COPY --from=builder /docnavigator/public ./public
COPY --from=builder /docnavigator/.next ./.next
COPY --from=builder /docnavigator/package.json ./package.json
COPY --from=builder /docnavigator/.env ./.env

EXPOSE 3000
CMD ["yarn", "start"]