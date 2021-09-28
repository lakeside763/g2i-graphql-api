FROM node:12.18.3-alpine
LABEL author="Olalekan Idowu"

ARG PACKAGES=nano

RUN apk update && apk add $PACKAGES

WORKDIR /app
COPY ./package.json ./
COPY yarn.lock ./
RUN yarn install

COPY prisma/schema.prisma ./prisma/
COPY database.json ./

# RUN npx db-migrate up
RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]
