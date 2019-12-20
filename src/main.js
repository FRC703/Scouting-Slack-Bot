const TBA = require("tba-api-storm");
const { WebClient } = require("@slack/web-api");
const { IncomingWebhook } = require("@slack/webhook");
const { createEventAdapter } = require("@slack/events-api");
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
const port = process.env.SLACK_EVENT_PORT || 703;

let slack_api;
let slack;
let tba;
let slackEvents;

let db;

async function setup() {
  let adapter = new FileSync("/scouting.json");
  db = low(adapter);

  db.defaults({
    status: "NO_EVENT",
    events: [],
    users: {},
    userInterface: {}
  }).write();

  slack = new IncomingWebhook(webook_url);
  slack_api = new WebClient(slack_token);
  tba = new TBA(tba_token);
  slackEvents = createEventAdapter(slack_signing_secret);
  await slackEvents.start(port);

  // Event Listeners
  slackEvents.on("app_home_opened", apphome);
  slackEvents.on("block_actions", block_action);
  slackEvents.on("error", error => {
    console.log(error.name);
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
    console.log(view);
    const result = await slack_api.views.publish({
      user_id: event.user,
      view: view
    });
    console.log(result);
  }
}

async function block_action(event) {
  console.log(event);
}

async function challenge() {}

(async function() {
  setup();
})();
