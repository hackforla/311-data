# base image
FROM node:12.2.0-alpine
RUN npm install webpack webpack-cli -g

WORKDIR /tmp
COPY package.json /tmp/
RUN npm config set registry http://registry.npmjs.org/ && npm install

WORKDIR /app
COPY . /app/
RUN cp -a /tmp/node_modules /app/

RUN webpack

ENV NODE_ENV=production
ENV PORT=8080
RUN ls
CMD [ "npm", "run-script", "dev" ]

EXPOSE 8080
