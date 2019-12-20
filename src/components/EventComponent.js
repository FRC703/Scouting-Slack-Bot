const {
  TextSection,
  FieldSection,
  DropdownSection,
  ButtonAction,
  ActionSection,
  Divider
} = require("./subcomponents");

module.exports = async function Event(event, tba) {
  let eventTeams = await tba.getEventTeamsKeys(event.key);
  let teamCount = eventTeams.length;
  return [
    FieldSection(`<https://thebluealliance.com/${event.key}|*${event.name}*>`, [
      event.address,
      `Team Count: ${teamCount}`,
      `Date: ${event.start_date}`
    ]),
    ActionSection(ButtonAction("Select Event", `select_event:${event.key}`)),
    Divider()
  ];
};
