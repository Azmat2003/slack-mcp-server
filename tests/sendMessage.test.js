import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

import { registerSendMessageTool } from "../src/tools/sendMessage.js";

test("send_slack_message registers correctly", () => {
  const registeredTools = new Map();

  const mockServer = {
    registerTool(name, config, handler) {
      registeredTools.set(name, {
        config,
        handler,
      });
    },
  };

  registerSendMessageTool(mockServer);

  const tool = registeredTools.get("send_slack_message");

  assert.ok(tool);
  assert.equal(
    tool.config.description,
    "Send a message to a Slack channel"
  );

  assert.equal(tool.config.annotations.readOnlyHint, false);
  assert.equal(tool.config.annotations.destructiveHint, false);
  assert.equal(tool.config.annotations.idempotentHint, false);
  assert.equal(tool.config.annotations.openWorldHint, true);
});

test("should accept valid message inputs", () => {
  const registeredTools = new Map();

  const mockServer = {
    registerTool(name, config, handler) {
      registeredTools.set(name, { config, handler });
    },
  };

  registerSendMessageTool(mockServer);

  const { inputSchema } =
    registeredTools.get("send_slack_message").config;

  const validInput = {
    channelId: "C123456",
    message: "Hello everyone!",
  };

  const result = z.object(inputSchema).safeParse(validInput);

  assert.equal(result.success, true);
});

test("should reject an empty message", () => {
  const registeredTools = new Map();

  const mockServer = {
    registerTool(name, config, handler) {
      registeredTools.set(name, { config, handler });
    },
  };

  registerSendMessageTool(mockServer);

  const { inputSchema } =
    registeredTools.get("send_slack_message").config;

  const invalidInput = {
    channelId: "C123456",
    message: "",
  };

  const result = z.object(inputSchema).safeParse(invalidInput);

  assert.equal(result.success, false);
});

test("should reject missing channel ID", () => {
  const registeredTools = new Map();

  const mockServer = {
    registerTool(name, config, handler) {
      registeredTools.set(name, { config, handler });
    },
  };

  registerSendMessageTool(mockServer);

  const { inputSchema } =
    registeredTools.get("send_slack_message").config;

  const invalidInput = {
    message: "Hello everyone!",
  };

  const result = z.object(inputSchema).safeParse(invalidInput);

  assert.equal(result.success, false);
});