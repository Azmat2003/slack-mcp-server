import "dotenv/config";
import { WebClient } from "@slack/web-api";

export const slackBot = new WebClient(
  process.env.SLACK_BOT_TOKEN
);

export const slackUser = new WebClient(
  process.env.SLACK_USER_TOKEN
);