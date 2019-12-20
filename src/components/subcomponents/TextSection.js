module.exports = function(text) {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: text
    }
  };
};
