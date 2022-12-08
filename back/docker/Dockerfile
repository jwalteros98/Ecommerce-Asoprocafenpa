FROM node:16 as builder

COPY back/ /app
WORKDIR /app
RUN npm install
EXPOSE 4201
CMD npm run prod