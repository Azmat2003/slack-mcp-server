import { listSlackChannels } from "../services/slackService.js";

export function registerListChannelsTool(server) {
  server.registerTool(
    "list_slack_channels",
    {
      description: "List public Slack channels",
    },
    async () => {
      try {
        const channels = await listSlackChannels();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(channels, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Slack API error: ${error.message}`,
            },
          ],
        };
      }
    }
  );
}