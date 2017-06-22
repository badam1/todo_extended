FROM kkarczmarczyk/node-yarn
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn install
EXPOSE 8080
CMD [ "yarn", "run", "start" ]