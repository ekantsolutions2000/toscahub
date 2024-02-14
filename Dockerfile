# build environment
FROM node:15.11-alpine as build
WORKDIR /app
COPY .env *.json *.js /app/
COPY public /app/public/
COPY src /app/src/
RUN npm install -g npm@7.6.3
RUN npm install && npm run build:css
CMD ["npm", "run", "serve"]
