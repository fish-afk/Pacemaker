FROM node:16 
# node buster slim having issues with /bin/sh

WORKDIR /app

COPY . .

EXPOSE 3000

RUN npm install

CMD ["node", "server.js"]