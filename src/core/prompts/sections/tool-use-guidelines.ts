export function getToolUseGuidelinesSection(): string {
	return `# Tool Use Guidelines

1. Assess what you know and what you need to proceed.
2. Choose the most appropriate tool for the task. Prefer native tools (list_files over ls, read_file over cat).
3. Use multiple tools in a single message when appropriate. Base each step on previous results.`
}
