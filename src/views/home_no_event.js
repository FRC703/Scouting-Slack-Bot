const TextSection = require("../components/TextSection");
const DropdownSection = require("../components/DropdownSection");

async function homeNoEvent(tba, event) {
  let events = await tba.getTeamEventListSimple(703, 2019);
  console.log(events);
  let dropdown_events = events.map(event => ({
    text: {
      type: "plain_text",
      text: event.name,
      emoji: false
    },
    value: event.key
  }));
  return [
    TextSection("No event currently selected. Select an event."),
    DropdownSection("Select an event: ", dropdown_events)
  ];
}

module.exports = { homeNoEvent };
