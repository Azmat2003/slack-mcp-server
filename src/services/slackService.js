import { slackBot } from "../config/slack.js";
import { slackUser } from "../config/slack.js";

export async function listSlackChannels() {
  const response = await slackBot.conversations.list({
    types: "public_channel",
    limit: 100,
  });

  return (response.channels ?? []).map((channel) => ({
    id: channel.id,
    name: channel.name,
  }));
}

export async function sendSlackMessage(channelId, message) {
  const response = await slackBot.chat.postMessage({
    channel: channelId,
    text: message,
  });

  return {
    channel: response.channel,
    timestamp: response.ts,
    message: response.message?.text,
  };
}

export async function setSlackStatus(text, emoji, duration) {
  const expiration = duration
    ? Math.floor(Date.now() / 1000) + duration * 60
    : 0;

  const response = await slackUser.users.profile.set({
    profile: {
      status_text: text,
      status_emoji: emoji,
      status_expiration: expiration,
    },
  });

  return response.profile;
}

export async function clearSlackStatus() {
  const response = await slackUser.users.profile.set({
    profile: {
      status_text: "",
      status_emoji: "",
      status_expiration: 0,
    },
  });

  return response.profile;
}