import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerListChannelsTool } from "./tools/listChannels.js";
import { registerSendMessageTool } from "./tools/sendMessage.js";
import { registerSetStatusTool } from "./tools/setStatus.js";
import { registerClearStatusTool } from "./tools/clearStatus.js";

const server = new McpServer({
  name: "slack-mcp-server",
  version: "1.0.0",
});

registerListChannelsTool(server);
registerSendMessageTool(server);
registerSetStatusTool(server);
registerClearStatusTool(server);

async function main(){
  try{
    const transport = new StdioServerTransport(); 
    await server.connect(transport);
  }
  catch(err){
    console.error(err.message);
  }
}

main();