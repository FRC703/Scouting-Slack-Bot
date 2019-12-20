module.exports = function(text, value, style = "primary") {
  return {
    type: "button",
    text: {
      type: "plain_text",
      text: text
    },
    style: style,
    value: value
  };
};
