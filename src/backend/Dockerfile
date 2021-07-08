FROM node:14.0.0

LABEL author="Olalekan Idowu"

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . ./

RUN yarn prisma generate

CMD ["yarn", "start"]
