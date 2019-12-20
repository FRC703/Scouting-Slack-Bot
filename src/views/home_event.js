const TextSection = require("../components/subcomponents/TextSection");
const DropdownSection = require("../components/subcomponents/DropdownSection");

async function homeEvent(tba, event_key) {
  let event = await tba.getEvent(event_key);
  let x = [TextSection()];
}
