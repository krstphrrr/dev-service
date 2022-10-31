FROM nginx:alpine
RUN apk add bash && \
    apk add vim && \
    apk add curl
    
COPY ./nginx_container/default.conf /etc/nginx/conf.d/default.conf
