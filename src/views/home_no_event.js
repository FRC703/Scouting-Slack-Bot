const { TextSection } = require("../components/subcomponents");
const EventComponent = require("../components/EventComponent");

async function homeNoEvent(tba, event) {
  let events = await tba.getTeamEventList(703, 2019);
  events = events.sort(function(a, b) {
    return b.start_date > a.start_date
      ? -1
      : a.start_date > b.start_date
      ? 1
      : 0;
  });
  let eventList = await Promise.all(
    events.map(e => {
      return EventComponent(e, tba);
    })
  );
  let x = [
    TextSection("No event currently selected. Select an event."),
    ...eventList.flat()
  ];
  return x;
}

module.exports = { homeNoEvent };
