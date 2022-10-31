# Backend for datapacket provider service

![service diagram](https://github.com/Landscape-Data-Commons/data-packet-service/blob/master/data.svg)

Data requested through the LDC portal is extracted from the LDC postgres database, parsed into csv format, and compressed into a zip file. An persistent entry for each request is stored on a standalone mongo DB. Users need to be logged in the LDC client portal and each request must bear a JSON web token from Auth0. A SMTP server will send a link to the requested datapacket to the requester's email.

## Structure
The backend consists of 5 concurrent containers: 
1. Node js container receiving and responding to LDC client requests
2. Mongo DB container to store metadata about each request 
3. Mongo-express to visually manage the mongodb on a set endpoint
4. NGINX web server to reverse-proxy all containers with exposed endpoints
5. Cronjob container that shares a volume with the nodejs, and removes expired datapackets after a customizable amount of time.

## Requirements
- Latest Docker / docker compose 
- a .env file with all required enviromental variables (not included)

## To run 

Docker compose will orchestrate the start-up of all containers. 

```sh
docker-compose build  
docker-compose up -d 
```

# Current endpoints 

- *localhost/5001/mongo* for mongo-express dashboard 
- *localhost/5001/api/download-data* to create a pg db request, parse to csv, create mongo entry. (requires auth0 authentication)

# to do 
- tidy up
