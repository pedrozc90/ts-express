# stage 1: compile
FROM node:21.6-alpine AS builder

# update alpine packages
RUN apk update

# update npm
RUN npm update --global npm

# create application directory
WORKDIR /app

# bundle source code (.dockerignore will take care of unwanted files)
COPY . .

# install npm dependencies
RUN npm ci

# build project + transpile typescript
RUN npm run build

# stage 2
FROM node:21.6-alpine AS stage

# build arguments
ARG PORT=4000

# define enviroment variables
ENV PORT=$PORT
ENV NODE_ENV="production"
ENV APP_NAME="ts-express"
ENV APP_VERSION="1.0.1"

ENV JWT_SECRET="development"
ENV JWT_EXPIRATION="24h"

# update alpine packages
RUN apk update

# update npm
RUN npm update --global npm

# create application directory
WORKDIR /app

# copy files from the first stage into seconds stage workdir
COPY --from=builder "/app/dist" "/app/dist"
COPY --from=builder "/app/package*.json" "/app/"

# install only production dependencies
RUN npm install

RUN ls -al

EXPOSE $PORT

# rum server
CMD [ "node", "/app/dist/index.js" ]
