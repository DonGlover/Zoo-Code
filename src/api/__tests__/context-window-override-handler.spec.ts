import { describe, it, expect, beforeEach, vi } from "vitest"
import { ContextWindowOverrideHandler } from "../context-window-override-handler"
import type { ApiHandler, ApiHandlerCreateMessageMetadata } from "../index"
import type { ApiStream } from "../transform/stream"
import type Anthropic from "openai"

describe("ContextWindowOverrideHandler", () => {
	let mockInnerHandler: ApiHandler
	let overrideHandler: ContextWindowOverrideHandler

	beforeEach(() => {
		// Create a mock inner handler
		mockInnerHandler = {
			createMessage: vi.fn(() => ({}) as ApiStream),
			getModel: vi.fn(() => ({
				id: "test-model",
				info: {
					contextWindow: 200000,
					maxTokens: 8192,
					supportsPromptCache: true,
				},
			})),
			getCondenseContextWindow: vi.fn(() => 200000),
			countTokens: vi.fn(async () => 100),
		}

		overrideHandler = new ContextWindowOverrideHandler(mockInnerHandler, 8000)
	})

	it("should override contextWindow in getModel().info", () => {
		const result = overrideHandler.getModel()
		expect(result.id).toBe("test-model")
		expect(result.info?.contextWindow).toBe(8000)
		expect(result.info?.maxTokens).toBe(8192) // Should be preserved
	})

	it("should return override value from getCondenseContextWindow", () => {
		const result = overrideHandler.getCondenseContextWindow()
		expect(result).toBe(8000)
	})

	it("should delegate createMessage to inner handler", () => {
		const systemPrompt = "test prompt"
		const messages: Anthropic.Messages.MessageParam[] = []
		const metadata: ApiHandlerCreateMessageMetadata = {
			budget: {},
			customInstructions: {},
		}

		overrideHandler.createMessage(systemPrompt, messages, metadata)

		expect(mockInnerHandler.createMessage).toHaveBeenCalledWith(systemPrompt, messages, metadata)
	})

	it("should delegate countTokens to inner handler", async () => {
		const content: Anthropic.Messages.ContentBlockParam[] = []
		const result = await overrideHandler.countTokens(content)

		expect(mockInnerHandler.countTokens).toHaveBeenCalledWith(content)
		expect(result).toBe(100)
	})

	it("should handle undefined modelInfo gracefully", () => {
		mockInnerHandler.getModel = vi.fn(() => ({
			id: "test-model",
			info: undefined,
		}))

		const result = overrideHandler.getModel()
		expect(result.info).toBeUndefined()
	})
})
