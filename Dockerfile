FROM node:7.7.3-slim

# Create app directory
RUN         mkdir -p /usr/src/app
WORKDIR     /usr/src/app

# Install app dependencies
ADD         package.json                /usr/src/app/
RUN                                     npm install --silent
ENV         PORT                        8080

# Bundle app source
ADD         .                           /usr/src/app

EXPOSE      8080

CMD         [ "npm", "start" ]
