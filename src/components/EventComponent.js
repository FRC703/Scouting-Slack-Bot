const {
  TextSection,
  FieldSection,
  DropdownSection
} = require("./subcomponents");

module.exports = async function Event(event, tba) {
  let eventTeams = await tba.getEventTeamsKeys(event.key);
  let teamCount = eventTeams.length;
  return [
    TextSection(`<https://thebluealliance.com/${event.key}|*${event.name}*>`),
    FieldSection([
      event.address,
      `Team Count: ${teamCount}`,
      `Date: ${event.start_date}`
    ])
  ];
};
