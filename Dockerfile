FROM nginx:stable-alpine as runtime
RUN rm -rf /usr/share/nginx/html/*
ADD ./build /usr/share/nginx/html
ADD ./devOps/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]