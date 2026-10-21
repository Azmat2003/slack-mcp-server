import { clearSlackStatus } from "../services/slackService.js";

export function registerClearStatusTool(server) {
  server.registerTool(
    "clear_slack_status",
    {
      description: "Clear my current Slack status",

      inputSchema: {},

      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async () => {
      try {
        await clearSlackStatus();

        return {
          content: [
            {
              type: "text",
              text: "Slack status cleared successfully",
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Failed to clear Slack status: ${error.message}`,
            },
          ],
        };
      }
    }
  );
}