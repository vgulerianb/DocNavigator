FROM node:lts as builder

WORKDIR /docnavigator

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:lts

WORKDIR /docnavigator

COPY --from=builder /docnavigator .

# Copy .env if it exists
COPY --from=builder /docnavigator/.env* ./

EXPOSE 3000

CMD ["yarn", "start"]