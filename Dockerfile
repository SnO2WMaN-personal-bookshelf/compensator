FROM node:14 AS build

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY tsconfig.json tsconfig.json
COPY src src

RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:14

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY fonts fonts
COPY --from=build dist dist

RUN yarn install --frozen-lockfile --production

EXPOSE 3000
CMD [ "yarn", "start" ]
