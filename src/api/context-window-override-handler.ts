import type { Anthropic } from "@anthropic-ai/sdk"

import type { ApiHandler, ApiHandlerCreateMessageMetadata, ModelCacheScope } from "./index"
import type { ApiStream } from "./transform/stream"

/**
 * Wraps any ApiHandler to override its getModel().info.contextWindow with a user-supplied value.
 * Applies the override to both the reported context window and the condense threshold.
 * This enables users to override advertised limits for constrained deployments (quantized local models,
 * throttled API tiers, etc.) without modifying individual provider implementations.
 */
export class ContextWindowOverrideHandler implements ApiHandler {
	constructor(
		private readonly inner: ApiHandler,
		private readonly overrideContextWindow: number,
	) {}

	createMessage(
		systemPrompt: string,
		messages: Anthropic.Messages.MessageParam[],
		metadata?: ApiHandlerCreateMessageMetadata,
	): ApiStream {
		return this.inner.createMessage(systemPrompt, messages, metadata)
	}

	getModel() {
		const { id, info } = this.inner.getModel()
		return {
			id,
			info: info ? { ...info, contextWindow: this.overrideContextWindow } : info,
		}
	}

	getCondenseContextWindow(): number {
		return this.overrideContextWindow
	}

	countTokens(content: Array<Anthropic.Messages.ContentBlockParam>) {
		return this.inner.countTokens(content)
	}

	getModelCacheScope(): ModelCacheScope {
		return this.inner.getModelCacheScope()
	}
}
