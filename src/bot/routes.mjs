import express from 'express';
import { getLogger } from '../config/index';
// import { urlencoded, json } from 'body-parser';
import { createEventAdapter } from '@slack/events-api';
import { createMessageAdapter } from '@slack/interactive-messages';

const logger = getLogger(__filename);
export function ListenToAPI({
  port,
  slackSecret,
  controllers: {
    handleSlash,
    handleButton,
    handledMessage,
    addNewWorkspace,
    handleDialogSubmission
  }
}) {
  const app = express();
  const defaultUrl = 'https://myhomepage.io';
  const redirectUrl = 'https://myhomepage.io/bot-confirm/';
  const slackEvents = createEventAdapter(slackSecret);
  const slackInteractions = createMessageAdapter(slackSecret);

  // forward all events and interactions form the routes to the slack sdk)
  app.use('/events', slackEvents.expressMiddleware());
  app.use('/interactive', slackInteractions.expressMiddleware());

  // list of event and the controller that each use
  const events = [
    { event: 'message', controller: handledMessage },
    { event: 'app_mention', controller: handledMessage },
    { event: 'create_bot', controller: addNewWorkspace },
    { event: 'scope_granted', controller: addNewWorkspace },
    { event: 'error', controller: err => logger.error('error from event', err) }
  ];
  // sign the controller to the event
  events.forEach(({ event, controller }) => slackEvents.on(event, controller));

  // list of interactions and the controller that each use
  const interactions = [
    { action: 'welcome_button', controller: handleButton },
    {
      action: { type: 'button' },
      controller: handleButton
    },
    {
      action: { type: 'dialog_submission' },
      controller: handleDialogSubmission
    },
    {
      action: 'error',
      controller: err => logger.error('error from interaction', err)
    }
  ];

  // sign the controller to the interaction
  interactions.forEach(({ action, controller }) =>
    slackInteractions.action(action, controller)
  );

  // configure rest api
  // app.use(urlencoded({ extended: false }));
  // app.use(json());

  app.post('/slash', handleSlash);

  app.get('/oauth', (req, res) => {
    // addNewWorkspace(req);
    res.redirect(redirectUrl);
  });
  app.get('/*', (req, res) => res.send(defaultUrl));
  app.listen(port, () => logger.info(`app listening on port ${port}`));

  return app;
}
