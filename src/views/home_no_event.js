const TextSection = require("../components/subcomponents/TextSection");
const DropdownSection = require("../components/subcomponents/DropdownSection");

async function homeNoEvent(tba, event) {
  let events = await tba.getTeamEventListSimple(703, 2019);
  let dropdown_events = events.sort(function(a, b) {
    return a.start_date > b.start_date;
  });
  let events = events.map(e => { return (await EventComponent(e, tba))})
  let x = [
    TextSection("No event currently selected. Select an event."),
    ...events.flat()
  ];
  return x;
}

module.exports = { homeNoEvent };
