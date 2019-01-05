FROM node:10-alpine

COPY package.json package-lock.json ./
RUN npm install --only=production

ADD . ./

ENV PORT=80
CMD npm run start