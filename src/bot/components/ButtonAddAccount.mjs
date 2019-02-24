export const ButtonAddAccount = accountName => ({
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `do you want to add account: ${accountName} to slack`
      }
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'Yes'
          },
          value: 'addAcount'
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'No'
          }
        }
      ]
    }
  ]
});
