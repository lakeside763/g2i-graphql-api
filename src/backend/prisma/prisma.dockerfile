FROM node:12.18.3-alpine

RUN mkdir /app
WORKDIR /app


COPY ./ ./prisma/

CMD prisma studio
