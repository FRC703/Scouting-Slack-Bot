const TextSection = require("../components/TextSection");
const DropdownSection = require("../components/DropdownSection");

async function homeEvent(tba, event_key) {
  let event = await tba.getEvent(event_key);
}
