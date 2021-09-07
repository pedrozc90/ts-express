# stage 1: compile
FROM node:14.17.6-alpine AS builder

# update alpine packages
RUN apk update

# create application directory
WORKDIR /usr/src/app

# bundle source code (.dockerignore will take care of unwanted files)
COPY . .

# install packages
RUN npm install

# transpile typescript
RUN npm run build

# stage 2: transpiler typescript to javascript
FROM node:14.17.6-alpine

# update alpine packages
RUN apk update

# create application directory
WORKDIR /usr/src/app

# create new dist directory
RUN mkdir dist

COPY package.json .

# install only production dependencies
RUN npm install --only=production

# copy files from the first stage into seconds stage workdir
COPY --from=builder /usr/src/app/dist ./dist/

# define enviroment variables
ENV NODE_ENV="development"
ENV HTTP_HOST="localhost"
ENV HTTP_PORT=9000
ENV JWT_SECRET="development"
ENV JWT_EXPIRATION="24h"

EXPOSE 9000

# rum server
CMD [ "node", "dist/index.js" ]
