export function parseMessage(message) {
  const [command, ...query] = message
    .replace(/<.+>/, '')
    .replace(/ +/, ' ')
    .trim()
    .split(' ');
  //TODO: escape char and other security shit
  return [command, query.join(' ')];
}
