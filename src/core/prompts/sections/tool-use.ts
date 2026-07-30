export function getSharedToolUseSection(): string {
	return `====

TOOL USE

You have access to tools executed with user approval. Use the provider-native tool-calling mechanism. You must call at least one tool per assistant response. Prefer calling as many tools as are reasonably needed in a single response to reduce back-and-forth and complete tasks faster.`
}
