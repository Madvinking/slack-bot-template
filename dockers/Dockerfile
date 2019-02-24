FROM node:11.9.0-alpine

#used by the bot
EXPOSE 8080
#used by express for slash commands
WORKDIR /slackbot

COPY package.json   package.json
COPY dist           dist

RUN yarn --only=production
CMD ["yarn", "start"]



