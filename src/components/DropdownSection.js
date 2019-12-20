module.exports = function(text, dropdown_opts, placeholder_text = "") {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: text
    },
    accessory: {
      type: "static_select",
      placeholder: {
        type: "plain_text",
        text: placeholder_text || "Select an item",
        emoji: true
      },
      options: dropdown_opts
    }
  };
};
