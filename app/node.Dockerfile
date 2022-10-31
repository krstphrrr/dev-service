#  using node alpine 3.13
# FROM node:alpine3.15 
FROM node:16.13.0-alpine3.14

# dev dependencies
RUN apk update && \
    apk add curl && \ 
    apk add vim && \
    apk add bash


#  setting workdir usr /app inside container
WORKDIR /usr/src/

#  copying local directory into /usr/app
COPY ./app /usr/src/

#  updating npm 
# RUN npm install -g npm@8.15.0

#  installing app dependencies/packages
RUN npm install


EXPOSE 5100
# uncomment below to run development
# mode with nodemon inside container

# CMD ["npm", "run", "dev"]
CMD ["npm", "start"]