import { z } from "zod";
import { sendSlackMessage } from "../services/slackService.js";

export function registerSendMessageTool(server) {
  server.registerTool(
    "send_slack_message",
    {
      description: "Send a message to a Slack channel",

      inputSchema: {
        channelId: z.string().describe("Slack channel ID"),
        message: z.string().min(1).describe("Message to send"),
      },

      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ channelId, message }) => {
      try {
        const result = await sendSlackMessage(channelId, message);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Failed to send message: ${error.message}`,
            },
          ],
        };
      }
    }
  );
}