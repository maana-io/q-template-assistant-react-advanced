FROM node:10.15.3-alpine AS builder

ENV REACT_APP_VAR='test variable'

WORKDIR /usr/app

COPY package* ./
COPY src ./src
COPY public ./public

RUN npm install
RUN npm run-script build

# Build the app for deployment
FROM nginx:stable

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=0 /usr/app/build/ /maana/

EXPOSE 3399