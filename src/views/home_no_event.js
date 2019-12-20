const TextSection = require("../components/TextSection");
const DropdownSection = require("../components/DropdownSection");

async function homeNoEvent(tba, event) {
  let events = await tba.getTeamEventListSimple(703, 2019);
  let dropdown_events = events.map(e => {
    console.log(e.name, e.key);
    return {
      text: {
        type: "plain_text",
        text: e.name,
        emoji: false
      },
      value: "event_select:" + e.key
    };
  });
  let x = [
    TextSection("No event currently selected. Select an event."),
    DropdownSection("Select an event: ", dropdown_events)
  ];
  return x;
}

module.exports = { homeNoEvent };
