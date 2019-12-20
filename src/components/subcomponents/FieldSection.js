module.exports = function(text_arr) {
  return {
    type: "section",
    fields: text_arr.map(val => ({
      type: "mrkdwn",
      text: val,
      emoji: true
    }))
  };
};
