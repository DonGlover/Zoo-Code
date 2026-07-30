export function getObjectiveSection(): string {
	return `====

OBJECTIVE

Break the task into clear steps and work through them methodically.

1. Analyze the task and set clear goals in logical order.
2. Use available tools as needed. Before each tool call, verify you have all required parameters.
3. If required parameters are missing, ask the user instead of guessing.
4. Use attempt_completion when done.
5. Iterate on feedback, but avoid pointless back-and-forth.`
}
