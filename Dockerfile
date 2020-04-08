FROM node:12.16.1-alpine
RUN npm config set unsafe-perm true
RUN npm install --silent webpack webpack-cli -g
WORKDIR /tmp
COPY package.json /tmp/
RUN npm config set registry http://registry.npmjs.org/ && npm install --silent
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN cp -a /tmp/node_modules /usr/src/app/
#RUN webpack
ENV NODE_ENV=production
ENV PORT=3000
ENV REACT_APP_MAPBOX_TOKEN=REDACTED
RUN ls
CMD [ "sh", "copyEnv.sh"]
EXPOSE 3000
