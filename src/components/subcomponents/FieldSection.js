module.exports = function(text, text_arr) {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: text
    },
    fields: text_arr.map(val => ({
      type: "mrkdwn",
      text: val,
      emoji: true
    }))
  };
};
