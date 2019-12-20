const TBA = require("tba-api-storm");
const { WebClient } = require("@slack/web-api");
// const { IncomingWebhook } = require("@slack/webhook");
const { createEventAdapter } = require("@slack/events-api");
const { createMessageAdapter } = require("@slack/interactive-messages");
const { RTMClient } = require("@slack/rtm-api");
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

const defaultUser = { page: "" };

async function setup() {
  let adapter = new FileSync("./scouting.json");
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
  if (db.get(`users.${event.user}`).value() === undefined) {
    db.set(`users.${event.user}`, defaultUser).write();
  }
  let userPage = db.get(`users.${event.user}.page`).value() || "";
  if (event.tab === "home" && userPage === "") {
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
  } else {
    debug_tab(event);
  }
}

async function button(payload, respond) {
  console.log(payload);
  let action = payload.actions[0];
  let val_split = action.value.split(":");
  if (val_split[0] === "select_event") {
    db.set("currentEvent", val_split[1]).write();
    db.set("status", "EVENT_ACTIVE").write();
    let view = await homeEvent(tba, event);
  }
  if (val_split[0] === "open_tab") {
    console.log(payload.user.id);
    console.log(db.get(`users.${payload.user.id}.page`).value());
    switch (val_split[1]) {
      case "debug":
        db.set(`users.${payload.user.id}.page`, "debug").write();
        break;
      case "home":
        db.set(`users.${payload.user.id}.page`, "").write();
        break;
    }
    console.log(db.get(`users.${payload.user.id}.page`).value());
  }
}

async function debug_tab(event) {
  console.log(event);
  await slack_api.views.publish({
    user_id: event.user,
    view: {
      type: "home",
      blocks: [
        {
          type: "section",
          text: { type: "plain_text", text: JSON.stringify(db.getState()) }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Back to home"
              },
              style: "primary",
              value: "open_tab:debug"
            }
          ]
        }
      ]
    }
  });
}

(async function() {
  setup();
})();
