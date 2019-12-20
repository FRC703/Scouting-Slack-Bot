const TBA = require("tba-api-storm");
const { WebClient } = require("@slack/web-api");
const { createEventAdapter } = require("@slack/events-api");

const proxy = process.env.http_proxy
  ? new HttpsProxyAgent(process.env.http_proxy)
  : undefined;

const slack_token = process.env.SLACK_TOKEN;
const tba_token = process.env.TBA_TOKEN;
const webook_url = process.env.SLACK_WEBHOOK_URL;
const slack_signing_secret = process.env.SLACK_SIGNING_TOKEN;
const port = process.env.SLACK_EVENT_PORT || 703;

let slack;
let tba;
let slackEvents;

async function setup() {
  slack = new WebClient(slack_token);
  tba = new TBA(tba_token);
  slackEvents = createEventAdapter(slack_signing_secret);
  await slackEvents.start(port);

  // Event Listeners
  slackEvents.on("app_home_opened", apphome);
  slackEvents.on("error", error => {
    console.log(error.name);
  });
}

async function apphome() {}

async function challenge() {}

(async function() {
  setup();
})();
