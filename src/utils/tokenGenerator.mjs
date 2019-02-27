let token;
export function getRandomToken() {
  return tokenGenerator;
}

export function refresh() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  token = text;
}

refresh();

//refresh the token every 2 hour
setInterval(refresh, 1000 * 60 * 120);

export const tokenGenerator = {
  refresh,
  get: () => {
    return token;
  }
};
