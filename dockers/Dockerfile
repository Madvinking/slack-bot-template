FROM node:11.10.0-alpine

#used by the bot
EXPOSE 8080
WORKDIR /slackbot

COPY package.json   package.json
COPY dist           dist

RUN yarn --only=production
CMD ["yarn", "start"]



