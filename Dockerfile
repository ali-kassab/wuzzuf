FROM node:18

WORKDIR /myApp

COPY . /myApp

EXPOSE 3000
RUN npm install

CMD [ "npm","start" ]