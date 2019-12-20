const { TextSection } = require("../components/subcomponents");
const EventComponent = require("../components/EventComponent");

async function homeNoEvent(tba, event) {
  let events = await tba.getTeamEventListSimple(703, 2019);
  events = events.sort(function(a, b) {
    return a.start_date > b.start_date;
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
