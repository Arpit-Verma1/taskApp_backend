FROM node:20
# to fetch node v20 from docker image . basically forcing every devloper to use same node vs from docker cotainer

WORKDIR /app
#this is our workdir 

COPY . .
# this is we copy our current dir . to docker . dir 
RUN  npm install
# as we ignore node modules in doeker ignore file we have to run npm install for docker container 
EXPOSE 8000

#that where our docker server lie

CMD [ "npm", "run", "dev" ]


#docker build -t imagename dirname  -> to create image on dokcer
#docker run -p ourport:imageport imageName -> to create container 
#docker compose.yame file to run multiple service as one service is our backend and other one  is our database
  
