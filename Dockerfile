# build stage
FROM node:16-alpine as build-stage

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn config set registry https://registry.npmmirror.com/ && yarn install

COPY . .

RUN yarn build

FROM nginx:stable-alpine as runtime
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY --from=build-stage /app/devOps/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
