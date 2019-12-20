module.exports = function(text, button) {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: text
    },
    accessory: button
  };
};
