# build vue.js project
FROM node:lts-alpine AS builder
WORKDIR /webapp
COPY . /webapp
RUN npm config set registry "https://registry.npm.taobao.org/"
RUN npm install
RUN npm run build

# start nginx server
FROM nginx:latest
COPY --from=builder webapp/dist /usr/share/nginx/html/
COPY --from=builder webapp/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
