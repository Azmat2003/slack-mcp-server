# Slack MCP Server

A lightweight **Model Context Protocol (MCP)** server that connects AI assistants such as **Claude Desktop** to a Slack workspace. It exposes Slack operations as callable tools, allowing an assistant to interact with Slack through natural-language requests.

## Tech Stack

- **Node.js (ES Modules)** — server runtime
- **MCP SDK** — tool registration and communication with MCP clients
- **Slack Web API** — Slack workspace integration
- **Zod** — tool input validation
- **dotenv** — environment variable management

## Architecture

```text
Claude Desktop (MCP Client)
          |
          | MCP requests over stdio
          v
    Slack MCP Server
          |
          | Tool registration + input validation
          v
      Slack Web API
          |
          v
     Slack Workspace
```

The MCP server registers tools that an MCP-compatible client can discover and invoke. When a tool is called, the server validates its arguments, makes the appropriate Slack Web API request using the configured bot token, and returns the result to the client.

## Project Structure

```text
slack-mcp-server/
├── src/                 # MCP server and Slack tool implementations
├── .gitignore
├── package.json
└── package-lock.json
```

## Run Locally

**Prerequisites:** Node.js, a Slack workspace with permission to install apps, and Claude Desktop (or another MCP-compatible client).

### 1. Clone and install

```bash
git clone https://github.com/Azmat2003/slack-mcp-server.git
cd slack-mcp-server
npm install
```

### 2. Configure Slack

1. Create a Slack app at [api.slack.com/apps](https://api.slack.com/apps).
2. Under **OAuth & Permissions**, add the bot scopes required by the tools you plan to use (for example, `chat:write` for sending messages).
3. Install or reinstall the app to your workspace and copy its **Bot User OAuth Token** (`xoxb-...`).
4. Create a `.env` file in the project root:

```env
SLACK_BOT_TOKEN=xoxb-your-bot-token
```

Keep `.env` out of version control. Some Slack operations require the bot to be a member of the target channel.

### 3. Connect Claude Desktop

Open **Claude Desktop → Settings → Developer → Edit Config** and add the server to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "slack": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/slack-mcp-server/src/index.js"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token"
      }
    }
  }
}
```

Replace the path with the **actual server entry file** and use the full Node.js executable path if Claude Desktop cannot find `node` (for example, `/opt/homebrew/bin/node` on some Macs). Restart Claude Desktop to load the server.

> **Note:** The `src/index.js` path above is a placeholder: confirm the entry file in your local `src/` directory before running. The token environment variable must also match the name used in your source code.

## How It Works

1. Claude Desktop starts the MCP server as a local process.
2. The server exposes its registered Slack tools through MCP.
3. Claude selects a tool based on the user's request and supplies its arguments.
4. The server validates the input and calls Slack's API.
5. The result is returned to Claude for a user-friendly response.

## Future Improvements

- Resolve Slack channels by name, including handling ambiguous matches.
- Expand the set of supported Slack operations.
- Improve error handling and permission feedback.
