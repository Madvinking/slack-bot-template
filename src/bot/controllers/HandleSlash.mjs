export function HandleSlash() {
  return async function() {
    // const {
    //   text,
    //   user_id: user,
    //   channel_id: channel,
    //   team_id: team,
    //   trigger_id,
    //   response_url
    // } = req.body;
    // console.log('TCL: req.body', req.body);
    // const dialog = queryString.stringify({
    //   trigger_id,
    //   token: SLACK_TOKEN,
    //   dialog: JSON.stringify({
    //     callback_id: 'addAcount',
    //     title: 'add account',
    //     submit_label: 'add',
    //     state: 'Limo',
    //     elements: [
    //       {
    //         type: 'text',
    //         label: 'account name:',
    //         name: 'accountName'
    //       }
    //     ]
    //   })
    // });
    // console.log('TCL: dialog', dialog);
    // try {
    //   await axios.post('https://slack.com/api/dialog.open', dialog, {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //     }
    //   });
    //   res.send('');
    // } catch (err) {
    //   console.log(err);
    // }
    // // const response = await receivedMessage({
    // //   text,
    // //   user,
    // //   team,
    // //   channel
    // // });
    // res.json(response);
    // };
  };
}
