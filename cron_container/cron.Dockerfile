#  using node alpine 3.13
# very similar to node dockerfile
FROM node:alpine3.13 

# dev dependencies
RUN apk update && \
    apk add curl && \ 
    apk add vim && \
    apk add bash


#  setting workdir usr /app inside container
WORKDIR /usr/src

#  copying local directory into /usr/app
COPY ./cron_container /usr/src

COPY ./app/db/ /usr/src/mongo-dependencies
COPY ./app/models/ /usr/src/mongo-dependencies

#  installing app dependencies/packages
# needs the mongoose infrastructure to run the script
RUN npm install
# ts-node global so cron can execute "ts-node" commands
RUN npm i ts-node typescript -g

# making sure the shell script that runs the ts script is executable
RUN chmod +x ./entry.sh 

# replacing old crontab with one with the necessary task added
RUN /usr/bin/crontab ./crontab

# run cronjob only!
CMD ["crond","-f", "-l", "0"]