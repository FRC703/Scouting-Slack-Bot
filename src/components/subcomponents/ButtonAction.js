module.exports = function(text, value, style = "primary") {
  return {
    type: "button",
    text: {
      type: "mrkdwn",
      text: text
    },
    style: style,
    value: value
  };
};
