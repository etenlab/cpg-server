FROM node:16

# Create app directory
WORKDIR /usr/src/etenlab/cpg-server

COPY . .

RUN npm ci --legacy-peer-deps
RUN npm run build

CMD [ "npm", "run", "start:prod" ]
