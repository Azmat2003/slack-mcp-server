import { z } from "zod";
import { setSlackStatus } from "../services/slackService.js";

export function registerSetStatusTool(server) {
  server.registerTool(
    "set_slack_status",
    {
      description: "Update my Slack status with text, emoji and duration",
      inputSchema: {
        text: z.string().min(1),
        emoji: z.string().default(":speech_balloon:"),
        duration: z.number().int().positive().optional()
          .describe("Duration in minutes"),
      },
    },
    async ({ text, emoji, duration }) => {
      try {
        const profile = await setSlackStatus(text, emoji, duration);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                status_text: profile?.status_text,
                status_emoji: profile?.status_emoji,
                status_expiration: profile?.status_expiration,
              }),
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Failed to update Slack status: ${error.message}`,
            },
          ],
        };
      }
    }
  );
}