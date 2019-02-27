import express from 'express';
import { getLogger } from '../config/index';
import { urlencoded, json } from 'body-parser';
import { createEventAdapter } from '@slack/events-api';
import { createMessageAdapter } from '@slack/interactive-messages';

const logger = getLogger(__filename);
export function ListenToAPI({
  port,
  slackSecret,
  controllers: {
    loginTeam,
    oauthTeam,
    afterOauth,
    handleSlash,
    handleButton,
    handledMessage,
    handleDialogSubmission
  }
}) {
  const app = express();
  app.use(urlencoded({ extended: false }));
  app.use(json());
  const defaultUrl = 'https://myhomepage.io';
  const slackEvents = createEventAdapter(slackSecret);
  const slackInteractions = createMessageAdapter(slackSecret);

  // forward all events and interactions form the routes to the slack sdk)
  app.use('/events', slackEvents.expressMiddleware());
  app.use('/interactive', slackInteractions.expressMiddleware());

  // list of event and the controller that each use

  const events = [
    { event: 'message', ctr: handledMessage },
    { event: 'app_mention', ctr: handledMessage },
    { event: 'error', ctr: err => logger.error('error from event', err) }
  ];
  // sign the controller to the event
  events.forEach(({ event, ctr }) => slackEvents.on(event, ctr));

  // list of interactions and the controller that each use
  const interactions = [
    { action: 'welcome_button', ctr: handleButton },
    {
      action: { type: 'button' },
      ctr: handleButton
    },
    {
      action: { type: 'dialog_submission' },
      ctr: handleDialogSubmission
    },
    {
      action: 'error',
      ctr: err => logger.error('error from interaction', err)
    }
  ];

  // sign the controller to the interaction
  interactions.forEach(({ action, ctr }) =>
    slackInteractions.action(action, ctr)
  );

  // configure rest api
  app.get('/login', loginTeam);
  app.get('/oauth', oauthTeam);
  app.post('/slash', handleSlash);
  app.get('/*', (req, res) => res.send(defaultUrl));
  app.listen(port, () => logger.info(`app listening on port ${port}`));

  return app;
}
