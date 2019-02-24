export function HandledError({ postMessage, db }) {
  return function(err, channel = null) {
    if (channel) {
      postMessage({ channel, text: err.message });
    }
  };
}
