const TBA = require("tba-api-storm");
const { WebClient } = require("@slack/web-api");
// const { IncomingWebhook } = require("@slack/webhook");
const { createEventAdapter } = require("@slack/events-api");
const { createMessageAdapter } = require("@slack/interactive-messages");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const { homeNoEvent } = require("./views/home_no_event");

const proxy = process.env.http_proxy
  ? new HttpsProxyAgent(process.env.http_proxy)
  : undefined;

const slack_token = process.env.SLACK_BOT_USER_OAUTH;
const tba_token = process.env.TBA_TOKEN;
const webook_url = process.env.SLACK_WEBHOOK_URL;
const slack_signing_secret = process.env.SLACK_SIGNING_TOKEN;
const eventPort = process.env.SLACK_EVENT_PORT || 703;
const interactPort = process.env.SLACK_INTERACT_PORT || 9993;

let slack_api;
let slackInteract;
let tba;
let slackEvents;

let db;

async function setup() {
  let adapter = new FileSync("/scouting.json");
  db = low(adapter);

  db.defaults({
    status: "NO_EVENT",
    currentEvent: "",
    events: [],
    users: {},
    userInterface: {}
  }).write();

  // slack = new IncomingWebhook(webook_url);
  slack_api = new WebClient(slack_token);
  tba = new TBA(tba_token);
  slackInteract = createMessageAdapter(slack_signing_secret);
  slackEvents = createEventAdapter(slack_signing_secret);
  await slackEvents.start(eventPort);
  await slackInteract.start(interactPort);

  // Event Listeners
  slackEvents.on("app_home_opened", apphome);
  slackInteract.action({ type: "button" }, button);
  slackEvents.on("error", error => {
    console.log(error);
  });
}

async function apphome(event) {
  console.log(event);
  let view;
  if (event.tab === "home") {
    let status = db.get("status").value();
    console.log(status);
    switch (status) {
      case "NO_EVENT":
        view = await homeNoEvent(tba, event);
        break;
    }
    console.log(JSON.stringify(view));
    const result = await slack_api.views.publish({
      user_id: event.user,
      view: { type: "home", blocks: view }
    });
  }
}

async function button(payload, respond) {
  let action = payload.actions[0];
  let val_split = action.value.split(":");
  if (val_split[0] === "select_event") {
    db.set("currentEvent", val_split[1]).write();
    db.set("status", "EVENT_ACTIVE").write();
    let view = await homeEvent(tba, event);
  }
}

async function challenge() {}

(async function() {
  setup();
})();
